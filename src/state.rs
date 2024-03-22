use std::collections::HashMap;

use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Deps, Addr, DepsMut, StdResult, Uint128, Uint64, Decimal};
use cw_storage_plus::{Item, Map};
// use serde::{Deserialize, Serialize};
use core::cmp::Ordering;
#[cw_serde]
pub struct Config {
    pub deal_creation_fee: u64,
    pub deal_creation_fee_denom: String,
    pub fee_percent: Decimal,
    pub fee_collector: Addr,
    pub admin: Addr,
}

pub const CONFIG: Item<Config> = Item::new("config");

#[cw_serde]
pub struct Deal {
    /// deal_creator is the address
    pub deal_creator: Addr,
    /// min_cap is the token threshold amount to begin swaps
    pub min_cap: Uint128,
    /// total_bid keeps information on how much is the total bid for this deal.
    pub total_bid: Uint128,
    pub deal_token_denom: String,
    pub deal_token_amount: Uint128,
    pub start_block: Uint128,
    pub end_block: Uint128,
    pub bid_token_denom: String,
    pub min_price: Decimal,
}

// DEAL_SEQ holds the last deal ID
pub const DEAL_SEQ: Item<u64> = Item::new("deal_seq");
pub const DEALS: Map<u64, Deal> = Map::new("deal");


#[cw_serde]
pub struct Bid {
    pub bidder: Addr,
    pub amount: Uint128,
    pub denom: String,
    pub price: Decimal,
}


pub const BID_SEQ: Item<u64> = Item::new("bid_seq");
pub const DEALSTORE: Map<u64, BidStore> = Map::new("deals");

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BidStore {
    pub bids: Vec<(u64,Bid)>,
}

impl BidStore {
    pub fn sort_by_price_desc(&mut self) {
        self.bids.sort_by(|a, b| {
            let cmp_price = b.1.price.cmp(&a.1.price); // Compare prices in descending order
            if cmp_price == std::cmp::Ordering::Equal {
                b.0.cmp(&a.0) // If prices are equal, compare bid IDs in ascending order
            } else {
                cmp_price
            }
        });
    }
}
impl Default for BidStore {
    fn default() -> Self {
        BidStore { bids: vec![] }
    }
}


#[cw_serde]
    pub enum Status {
        /// Waiting for start date
        Waiting,
        Active,
        Done,
        Cancelled,
    }    


