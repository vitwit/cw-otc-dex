use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("invalid fee percentage. should be a decimal value between 0 and 1")]
    InvalidFeePercent{},

    #[error("invalid deal creation fee. should be greaterthan 0")]
    InvalidDealCreationFee{},
}
