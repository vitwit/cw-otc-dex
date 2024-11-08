// error.rs
use cosmwasm_std::{StdError, OverflowError};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("{0}")]
    Overflow(#[from] OverflowError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Invalid time parameters: {reason}")]
    InvalidTimeParameters { reason: String },

    #[error("Bidding has not started yet")]
    BiddingNotStarted {},

    #[error("Bidding has ended")]
    BiddingEnded {},

    #[error("Deal cannot be concluded yet")]
    ConclusionTimeNotReached {},

    #[error("Deal already concluded")]
    DealAlreadyConcluded {},

    #[error("Insufficient platform fee. Required: {required}, provided: {provided}")]
    InsufficientPlatformFee {
        required: u128,
        provided: u128,
    },

    #[error("Invalid bid amount: {reason}")]
    InvalidBidAmount { reason: String },

    #[error("Bid not found for deal {deal_id} from bidder {bidder}")]
    BidNotFound {
        deal_id: u64,
        bidder: String,
    },

    #[error("Insufficient funds")]
    InsufficientFunds {},
}