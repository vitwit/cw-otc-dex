
use cosmwasm_std::StdError;
use thiserror::Error;
use serde::{ Deserialize, Serialize };
#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")] Std(#[from] StdError),

    #[error("Unauthorized")] Unauthorized {},

    #[error(
        "invalid fee percentage. should be a decimal value between 0 and 1"
    )] InvalidFeePercent {},

    #[error("invalid deal creation fee. should be greaterthan 0")] InvalidDealCreationFee {},

    #[error("Deal not existed ")] DealNotExisted {},

    #[error("Deal already Executed ")] DealExecuted {},

    #[error("Denom not matched ")] DenomNotMatched {},

    #[error("overflow error")] OverflowError {},

    #[error(
    "Deal Min-cap is not reached,so redistributed all the bids to bidders and deal amount to creator"
 )] MinimumCapacityNotReached {},

    #[error("no bidstore found")] BidStoreNotFound {},

    #[error("Bid id not found")] BidIDNotFound {},

    #[error("Deal is closed for bidding")] DealClosedForBidding {},

    #[error("Deal is not yet open for bidding")] DealNotOpenedForBidding{},

    #[error("Deal is Ended,You cannot withdraw your bid")] CannotWithdrawBid {},

    #[error(
        "Deal is Not Created because of start height is greater than end height or network current height"
    )] InvalidDealCreation {},

    #[error(
        "Deal Time period is not yet completed,You can't execute Deals"
    )] DealTimeNotFulfilled {},

    #[error("Minimum price not met to place the bid")] MinimumPriceNotSatisfied {},

    #[error("You cannot withdraw the bid,You are not the user of this bid")] InvalidBidder {},

    #[error(
        "You can't create the deal,signer and creator address not matched"
    )] InvalidDealCreator {},

    #[error("You can't cancel the deal,you are not the deal creator")] InvalidDealCanceller {},

    #[error("Invalid End Height for deal creation::height is already exceeded")] InvalidEndBlock {},

    #[error("sender and the bidder address are not matching")] InvalidBidderAddress {},
}

impl From<std::num::TryFromIntError> for ContractError {
    fn from(_: std::num::TryFromIntError) -> Self {
        ContractError::OverflowError {}
    }
}

impl From<ContractError> for StdError {
    fn from(err: ContractError) -> Self {
        StdError::GenericErr {
            msg: err.to_string(),
        }
    }
}
