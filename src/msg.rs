use crate::state::Status;
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128, Uint64, Decimal, Decimal256};
use cw_storage_plus::{Item, Map};
use std::ops::Mul;

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
}

// We define a custom struct for each query response
#[cw_serde]
pub struct DealResponse {
    /// creator_address is the address
    pub creator_address: String,
    /// id is the deal id
    pub id: Uint128,
}

// Message struct definitions
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct CreateDealMsg {
    // creator is the address of the Deal creator i.e., OTC order creator
    pub creator: Addr,
    pub denom: String,
    pub amount: Uint128,
    // bid_denom is the denom used for placing bids to buy the deal tokens
    pub bid_denom: String,
    // min_price is the minimum rate for the exchange of the 1 deal token (10uusdc for 1uatom for say)
    pub min_price: Decimal,
    pub start_time: u64,
    pub end_time: u64,
    pub min_cap: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct CancelDealMsg {
    pub deal_id: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct PlaceBidMsg {
    pub deal_id: u64,
    pub bid_amount: Uint128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct WithdrawBidMsg {
    pub bid_id: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct AcceptBidMsg {
    pub deal_id: u64,
    pub bid_ids: Vec<u64>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct ExecuteDealMsg {
    pub deal_id: u64,
}

// Struct for Deal
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Deal {
    pub creator: String,
    pub denom: String,
    pub amount: Uint128,
    pub min_price: Uint128,
    pub duration: u64,
    pub min_cap: Uint128,
    pub status: Status,
}

// Struct for Bid
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Bid {
    pub bidder: String,
    pub amount: Uint128,
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
    AcceptBid(AcceptBidMsg),
    ExecuteDeal(ExecuteDealMsg),
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct CreateDealResponse {
    pub deal_id: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct CancelDealResponse {
    pub deal_id: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct PlaceBidResponse {
    pub bid_id: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct WithdrawBidResponse {
    pub bid_id: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct AcceptBidResponse {
    pub deal_id: u64,
    pub accepted_bid_ids: Vec<u64>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct ExecuteDealResponse {
    pub deal_id: u64,
}