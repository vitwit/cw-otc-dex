use std::collections::HashMap;

use cosmwasm_schema::cw_serde;
use cosmwasm_std::{ Deps, Addr, DepsMut, StdResult, Uint128, Uint64, Decimal };
use cw_storage_plus::{ Item, Map };
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
    /// deal_title
    pub deal_title:String,
    //deal_description
    pub deal_description:String,
    /// deal_creator is the address
    pub deal_creator: Addr,
    /// min_cap is the token threshold to execute the deal
    pub min_cap: Uint128,
    /// total_bid keeps information on how much is the total bid for this deal.
    pub total_bid: Uint128,
    //Token denom which is kept for the deal
    pub deal_token_denom: String,
    //Amount which is kept for the deal
    pub deal_token_amount: Uint128,
    //start block
    pub start_block: u128,
    //end block
    pub end_block: u128,
    //Token denom which is allowed for bidding
    pub bid_token_denom: String,
    //minimum price to place a bid
    pub min_price: Decimal,
}

// DEAL_SEQ holds the last deal ID
pub const DEAL_SEQ: Item<u64> = Item::new("deal_seq");
//stores the mapping of deal_id an deal
pub const DEALS: Map<u64, Deal> = Map::new("deal");

#[cw_serde]
pub struct Bid {
    pub bidder: Addr,
    pub amount: Uint128,
    pub denom: String,
    pub price: Decimal,
}

//Used to generate unique sequence of  bid numbers
pub const BID_SEQ: Item<u64> = Item::new("bid_seq");
//Storing bidstore for respective deals
pub const DEALSTORE: Map<u64, BidStore> = Map::new("deals");

use schemars::JsonSchema;
use serde::{ Deserialize, Serialize };
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BidStore {
    pub bids: Vec<(u64, Bid)>,
}
