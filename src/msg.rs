use crate::state::{Bid,Deal};
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128, Uint64, Decimal, Decimal256};
use cw_storage_plus::{Item, Map};
use std::ops::Mul;
use serde::{Deserialize, Serialize};



#[cw_serde]
pub struct InstantiateMsg {
    // admin is the admin account address of the protocol
    pub admin: Option<String>,
    // fee_collector is the address of the fee collection account
    pub fee_collector: String,
    // fee_denom
    pub fee_denom: String,
    // deal_creation_fee is the minimum fee that the deal creator has to pay for creating the deal
    pub deal_creation_fee: u64,
    // fee_percent is the fees percentage, collected at the end of the deal / deal endtime
    pub fee_percent: Decimal
}

#[cw_serde]
pub enum ReceiveMsg {
    // Send sends token to an id with defined pot
    Send { id: Uint64 },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetDeal returns deal with given id
    #[returns(DealResponse)]
    GetDeal { id: Uint64 },
    #[returns(BidStoreResponse)]
    GetBidStore { id:Uint64},
    #[returns(BidStoreResponse)]
    GetBidDetails{id: Uint64,bid_id: Uint64},
}

// We define a custom struct for each query response
#[cw_serde]
pub struct DealResponse {   
       pub deal:Deal,
}
#[cw_serde]
pub struct BidStoreResponse{
    pub bids:Vec<(u64,Bid)>,
}
#[cw_serde]
pub struct BidResponse{
    pub bid:Bid,
}
// Message struct definitions
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct CreateDealMsg {
    pub deal_creator: Addr,
    /// min_cap is the token threshold amount to begin swaps
    pub min_cap: Uint128,
    /// total_bid keeps information on how much is the total bid for this deal.
    pub total_bid: Uint128,
    pub deal_token_denom: String,
    pub deal_token_amount: Uint128,
    pub start_block: u128,
    pub end_block: u128,
    pub bid_token_denom: String,
    pub min_price: Decimal,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct CancelDealMsg {
    pub deal_id: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct PlaceBidMsg {
    pub deal_id: u64,
    pub bidder: Addr,
    pub amount: Uint128,
    pub denom: String,
    pub price: Decimal,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct WithdrawBidMsg {
    pub bid_id: u64,
    pub deal_id:u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct ExecuteDealMsg {
    pub deal_id: u64,
}

// Enum to represent different message types
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    CreateDeal(CreateDealMsg),
    CancelDeal(CancelDealMsg),
    PlaceBid(PlaceBidMsg),
    WithdrawBid(WithdrawBidMsg),
    ExecuteDeal(ExecuteDealMsg),
}
