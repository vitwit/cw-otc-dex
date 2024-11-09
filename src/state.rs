use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct Config {
    pub platform_fee_percentage: u64,  // In basis points (100 = 1%)
}

#[cw_serde]
pub struct Deal {
    pub seller: String,
    pub sell_token: String,
    pub total_amount: Uint128,
    pub min_price: Uint128,
    pub discount_percentage: u64,  // In basis points (100 = 1%)
    pub min_cap: Uint128,
    pub bid_start_time: u64,
    pub bid_end_time: u64,
    pub conclude_time: u64,
    pub is_concluded: bool,
    pub total_bids_amount: Uint128,
}

#[cw_serde]
pub struct Bid {
    pub bidder: String,
    pub amount: Uint128,
    pub discount_percentage: u64,
    pub max_price: Option<Uint128>,
}

// Contract state storage
pub const CONFIG: Item<Config> = Item::new("config");
pub const DEAL_COUNTER: Item<u64> = Item::new("deal_counter");

// Maps for storing deals and bids
pub const DEALS: Map<u64, Deal> = Map::new("deals");
pub const BIDS: Map<(u64, &Addr), Bid> = Map::new("bids");

// Optional indexes for more efficient queries
pub const SELLER_DEALS: Map<(&Addr, u64), u64> = Map::new("seller_deals");
pub const BIDDER_DEALS: Map<(&Addr, u64), u64> = Map::new("bidder_deals");
pub const ACTIVE_DEALS: Map<u64, bool> = Map::new("active_deals");

// Helper functions for state management
impl Deal {
    pub fn is_active(&self, current_time: u64) -> bool {
        !self.is_concluded && 
        self.bid_start_time <= current_time && 
        self.bid_end_time > current_time
    }

    pub fn validate_times(&self, current_time: u64) -> bool {
        self.bid_start_time > current_time &&
        self.bid_end_time > self.bid_start_time &&
        self.conclude_time > self.bid_end_time
    }

    pub fn can_conclude(&self, current_time: u64) -> bool {
        !self.is_concluded && current_time >= self.conclude_time
    }

    pub fn can_bid(&self, current_time: u64) -> bool {
        !self.is_concluded && 
        current_time >= self.bid_start_time && 
        current_time < self.bid_end_time
    }
}

impl Bid {
    pub fn validate_bid(&self, deal: &Deal) -> bool {
        self.amount > Uint128::zero() &&
        self.discount_percentage <= 10000 // Max 100%
    }

    pub fn calculate_final_price(&self, deal: &Deal) -> Uint128 {
        let base_price = self.amount.multiply_ratio(deal.min_price, Uint128::new(1u128));
        let discount = base_price.multiply_ratio(self.discount_percentage, 100u128);
        base_price.saturating_sub(discount)
    }
}