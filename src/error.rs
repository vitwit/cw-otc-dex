use cosmwasm_std::{OverflowError, StdError};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("{0}")]
    Overflow(#[from] OverflowError),

    #[error("Deal not found")]
    DealNotFound {},

    #[error("Bid not found")]
    BidNotFound {},

    /// Error for invalid time parameters
    #[error("Invalid Time Parameters: {reason}")]
    InvalidTimeParameters { reason: String },

    /// Error for insufficient platform fee provided by the seller
    #[error("Insufficient Platform Fee: required {required}, provided {provided}")]
    InsufficientPlatformFee { required: u128, provided: u128 },

    /// Error when bidding has not started yet
    #[error("Bidding has not started yet")]
    BiddingNotStarted {},

    /// Error when bidding has already ended
    #[error("Bidding has ended")]
    BiddingEnded {},

    #[error("Invalid denomination: {reason}")]
    InvalidDenom { reason: String },

    #[error("No bid payment provided")]
    NoBidPayment {},

    /// Error for invalid bid amount or parameters
    #[error("Invalid Bid Amount: {reason}")]
    InvalidBidAmount { reason: String },

    /// Error when conclusion time has not been reached yet
    #[error("Conclusion time has not been reached")]
    ConclusionTimeNotReached {},

    /// Error when attempting to conclude a deal that is already concluded
    #[error("Deal has already been concluded")]
    DealAlreadyConcluded {},

    /// Error when a bid already exists for a bidder on a deal
    #[error("Bid already exists for this bidder")]
    BidAlreadyExists {},

    /// Error for unauthorized actions
    #[error("Unauthorized")]
    Unauthorized {},
}
