use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std::Uint128;
use crate::state::{Config, Deal, Bid};

/// Message for contract instantiation
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    /// Platform fee percentage in basis points
    pub platform_fee_percentage: u64,
}

/// Messages for executing contract functions
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    /// Creates a new OTC deal
    CreateDeal {
        /// Address of the token being sold
        sell_token: String,
        /// Total amount of tokens to sell
        total_amount: Uint128,
        /// Minimum price per token
        min_price: Uint128,
        /// Maximum discount percentage offered
        discount_percentage: u64,
        /// Minimum total value required for deal conclusion
        min_cap: Uint128,
        /// Unix timestamp for bid start
        bid_start_time: u64,
        /// Unix timestamp for bid end
        bid_end_time: u64,
        /// Unix timestamp for deal conclusion
        conclude_time: u64,
    },
    /// Places a new bid on an existing deal
    PlaceBid {
        /// ID of the deal to bid on
        deal_id: u64,
        /// Amount of tokens to buy
        amount: Uint128,
        /// Requested discount percentage
        discount_percentage: u64,
        /// Optional maximum price willing to pay
        max_price: Option<Uint128>,
    },
    /// Updates an existing bid
    UpdateBid {
        /// ID of the deal
        deal_id: u64,
        /// New amount of tokens to buy
        new_amount: Uint128,
        /// New requested discount percentage
        new_discount_percentage: u64,
        /// New maximum price willing to pay
        new_max_price: Option<Uint128>,
    },
    /// Withdraws an existing bid
    WithdrawBid {
        /// ID of the deal
        deal_id: u64,
    },
    /// Concludes a deal after its conclusion time
    ConcludeDeal {
        /// ID of the deal to conclude
        deal_id: u64,
    },
}

/// Messages for querying contract state
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    /// Get details of a specific deal
    GetDeal { deal_id: u64 },
    /// Get all bids for a specific deal
    GetBids { deal_id: u64 },
    /// Get contract configuration
    GetConfig {},
}

/// Response for GetDeal query
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct DealResponse {
    pub deal: Deal,
}

/// Response for GetBids query
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BidsResponse {
    pub bids: Vec<(String, Bid)>,
}

/// Response for GetConfig query
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ConfigResponse {
    pub config: Config,
}