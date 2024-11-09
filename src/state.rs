use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

/// Configuration for the OTC platform
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    /// Platform fee percentage in basis points (1/100 of a percent)
    /// e.g., 100 = 1%, 50 = 0.5%
    pub platform_fee_percentage: u64,
}

/// Represents an OTC deal created by a seller
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Deal {
    /// Address of the seller who created the deal
    pub seller: String,
    /// Address of the token being sold
    pub sell_token: String,
    /// Total amount of tokens being sold
    pub total_amount: Uint128,
    /// Minimum price per token that the seller will accept
    pub min_price: Uint128,
    /// Seller's maximum discount percentage they're willing to offer
    pub discount_percentage: u64,
    /// Minimum total value of bids required for the deal to conclude
    pub min_cap: Uint128,
    /// Unix timestamp when bidding starts
    pub bid_start_time: u64,
    /// Unix timestamp when bidding ends
    pub bid_end_time: u64,
    /// Unix timestamp when the deal can be concluded
    pub conclude_time: u64,
    /// Whether the deal has been concluded
    pub is_concluded: bool,
    /// Total amount of all active bids
    pub total_bids_amount: Uint128,
}

/// Represents a bid placed by a buyer
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Bid {
    /// Address of the bidder
    pub bidder: String,
    /// Amount of tokens the bidder wants to buy
    pub amount: Uint128,
    /// Discount percentage requested by the bidder
    pub discount_percentage: u64,
    /// Optional maximum price the bidder is willing to pay
    pub max_price: Option<Uint128>,
}

/// Stores the contract configuration
pub const CONFIG: Item<Config> = Item::new("config");

/// Counter for generating unique deal IDs
pub const DEAL_COUNTER: Item<u64> = Item::new("deal_counter");

/// Maps deal IDs to Deal structs
pub const DEALS: Map<u64, Deal> = Map::new("deals");

/// Maps (deal_id, bidder_address) to Bid structs
pub const BIDS: Map<(u64, &Addr), Bid> = Map::new("bids");
