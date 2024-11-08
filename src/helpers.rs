use cosmwasm_std::{
    Addr, Coin, CosmosMsg, BankMsg, Uint128, WasmMsg,
    to_binary, StdResult, Order, Storage,
};
use cw20::Cw20ExecuteMsg;

use crate::state::{BIDS, Bid};
use crate::error::ContractError;

/// Creates a CosmosMsg for transferring CW20 tokens
pub fn create_token_transfer_msg(
    token_addr: String,
    recipient: String,
    amount: Uint128,
) -> StdResult<CosmosMsg> {
    Ok(CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: token_addr,
        msg: to_binary(&Cw20ExecuteMsg::Transfer {
            recipient,
            amount,
        })?,
        funds: vec![],
    }))
}

/// Creates a CosmosMsg for sending native tokens
pub fn create_payment_msg(
    recipient: String,
    amount: Uint128,
    denom: &str,
) -> CosmosMsg {
    CosmosMsg::Bank(BankMsg::Send {
        to_address: recipient,
        amount: vec![Coin {
            denom: denom.to_string(),
            amount,
        }],
    })
}

/// Retrieves all bids for a deal, sorted by discount percentage
pub fn get_sorted_bids(
    storage: &dyn Storage,
    deal_id: u64,
) -> StdResult<Vec<(String, Bid)>> {
    let mut bids: Vec<(String, Bid)> = BIDS
        .prefix(deal_id)
        .range(storage, None, None, Order::Ascending)
        .map(|item| {
            let (addr, bid) = item?;
            Ok((addr.to_string(), bid))
        })
        .collect::<StdResult<Vec<_>>>()?;
    
    bids.sort_by(|a, b| a.1.discount_percentage.cmp(&b.1.discount_percentage));
    Ok(bids)
}

/// Validates deal time parameters
pub fn validate_deal_times(
    bid_start_time: u64,
    bid_end_time: u64,
    conclude_time: u64,
    current_time: u64,
) -> Result<(), ContractError> {
    if bid_start_time >= bid_end_time {
        return Err(ContractError::InvalidTimeParameters {
            reason: "Bid start time must be before bid end time".to_string(),
        });
    }
    if bid_end_time >= conclude_time {
        return Err(ContractError::InvalidTimeParameters {
            reason: "Bid end time must be before conclude time".to_string(),
        });
    }
    if bid_start_time < current_time {
        return Err(ContractError::InvalidTimeParameters {
            reason: "Bid start time must be in the future".to_string(),
        });
    }
    Ok(())
}

/// Calculates the platform fee for a given amount
pub fn calculate_platform_fee(
    amount: Uint128,
    fee_percentage: u64,
) -> StdResult<Uint128> {
    amount.multiply_ratio(fee_percentage, 10000u128)
}