use cosmwasm_std::{StdError, OverflowError};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("{0}")]
    Overflow(#[from] OverflowError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Deal not found")]
    DealNotFound {},

    #[error("Bid not found")]
    BidNotFound {},

    #[error("Deal already concluded")]
    DealAlreadyConcluded {},

    #[error("Invalid time parameters: {reason}")]
    InvalidTimeParameters { reason: String },

    #[error("Invalid bid amount: {reason}")]
    InvalidBidAmount { reason: String },

    #[error("Insufficient platform fee. Required: {required}, provided: {provided}")]
    InsufficientPlatformFee { required: u128, provided: u128 },

    #[error("Bidding has not started")]
    BiddingNotStarted {},

    #[error("Bidding has ended")]
    BiddingEnded {},

    #[error("Conclusion time not reached")]
    ConclusionTimeNotReached {},
}