
use cosmwasm_std::StdError;
use thiserror::Error;

/// Custom error types for the OTC platform contract
#[derive(Error, Debug)]
pub enum ContractError {
    /// Wraps std::error::Error
    #[error("{0}")]
    Std(#[from] StdError),

    /// When someone tries to execute an action they're not authorized for
    #[error("Unauthorized")]
    Unauthorized {},

    /// When deal times are invalid (e.g., end time before start time)
    #[error("Invalid time parameters: {reason}")]
    InvalidTimeParameters { reason: String },

    /// When someone tries to bid before the bidding period starts
    #[error("Bidding has not started yet")]
    BiddingNotStarted {},

    /// When someone tries to bid after the bidding period ends
    #[error("Bidding has ended")]
    BiddingEnded {},

    /// When someone tries to conclude a deal before its conclusion time
    #[error("Deal cannot be concluded yet")]
    ConclusionTimeNotReached {},

    /// When someone tries to modify a deal that's already concluded
    #[error("Deal already concluded")]
    DealAlreadyConcluded {},

    /// When the platform fee provided is less than required
    #[error("Insufficient platform fee. Required: {required}, provided: {provided}")]
    InsufficientPlatformFee {
        required: u128,
        provided: u128,
    },

    /// When the bid amount is invalid (e.g., zero)
    #[error("Invalid bid amount: {reason}")]
    InvalidBidAmount { reason: String },

    /// When trying to update or withdraw a non-existent bid
    #[error("Bid not found for deal {deal_id} from bidder {bidder}")]
    BidNotFound {
        deal_id: u64,
        bidder: String,
    },

    /// When the deal has insufficient funds for transfer
    #[error("Insufficient funds")]
    InsufficientFunds {},
}