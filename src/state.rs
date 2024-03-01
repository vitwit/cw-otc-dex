use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Deps, Addr, DepsMut, StdResult, Uint128, Uint64, Decimal};
use cw_storage_plus::{Item, Map};

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

/// DEAL_SEQ holds the last deal ID
pub const DEAL_SEQ: Item<u64> = Item::new("deal_seq");
pub const DEALS: Map<u64, Pot> = Map::new("deal");

pub fn save_deal(deps: DepsMut, deal: &Deal) -> StdResult<u64> {


    Ok(id)
}

pub fn get_deal(deps: Deps, id: u64) -> StdResult<Deal> {
    let deal: Deal = DEALS.load(deps.storage, id)?;
    Ok(deal)
}


#[cw_serde]
pub struct Bid {
    pub bidder: Addr,
    pub amount: Uint128,
    pub denom: String,
    pub price: Decimal,
}


pub const BID_SEQ: Item<u64> = Item::new("bid_seq");
pub const BIDS: Map<u64, Bid> = Map::new("bids");

#[cw_serde]
pub enum Status {
    /// Waiting for start date
    Waiting,
    Active,
    Done,
    Cancelled,
}