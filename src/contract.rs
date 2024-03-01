#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    from_binary, to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
    Uint128, Uint64, StdError, Decimal, BankMsg,
};

use cw2::{get_contract_version, set_contract_version};
use semver::Version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, DealResponse, QueryMsg, ReceiveMsg};
use crate::state::{ Config, Deal, CONFIG, DEALS, DEAL_SEQ};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:cw-dotc";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    // fee percent must be less than 1 and greater than 0
    if msg.fee_percent >= Decimal::one() || msg.fee_percent < Decimal::zero() {
        return Err(ContractError::InvalidFeePercent {});
    }

    if msg.deal_creation_fee == 0 {
        return Err(ContractError::InvalidDealCreationFee {});
    }

    let config = Config {
        deal_creation_fee: msg.deal_creation_fee,
        deal_creation_fee_denom: msg.fee_denom,
        fee_percent: msg.fee_percent,
        fee_collector: deps.api.addr_validate(&msg.fee_collector)?,
        admin: deps.api.addr_validate(&info.sender.to_string())?,
    };

    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", owner)
        .add_attribute("addr", msg.fee_collector))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateDealMsg {
            target_addr,
            threshold,
        } => execute_create_deal(deps, env, info, msg),
        ExecuteMsg::CancelDeal(deps, msg), => execute_cancel_deal(deps, info, msg),
    }
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
#[derive(Serialize, Deserialize)]
pub struct Deal {
    pub creator: String,
    pub denom: String,
    pub amount: Uint128,
    pub min_price: Uint128,
    pub duration: u64,
    pub min_cap: Uint128,
    pub is_active: bool,
}

// Struct for Bid
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Bid {
    pub bidder: String,
    pub amount: Uint128,
    pub deal_id: u64,
}

// Entry points for the message implementations
#[entry_point]
pub fn execute_create_deal(deps: DepsMut, _env: Env, info: MessageInfo, msg: CreateDealMsg) -> StdResult<Response> {
    // owner authentication
    let config = CONFIG.load(deps.storage)?;

    let deal = Deal {
        creator: info.sender.to_string(),
        denom: msg.denom,
        amount: msg.amount,
        min_price: msg.min_price,
        duration: msg.duration,
        min_cap: msg.min_cap,
        is_active: true,
    };

    // increment id if exists, or return 1
    let id = DEAL_SEQ.load(deps.storage)?;
    let id = Uint64::new(id).checked_add(Uint64::new(1))?.u64();
    DEAL_SEQ.save(deps.storage, &id)?;

    // save deal with id
    DEALS.save(deps.storage, id, deal)

    let creation_fee_msg = CosmosMsg::Bank(BankMsg::Send {
        to_address: config.fee_collector.to_string(),
        amount: vec![Coin {
            denom: config.deal_creation_fee_denom,
            amount: config.deal_creation_fee,
        }],
    });

    // msg for locking otc deposit in the contract
    let lock_funds_msg = {
        CosmosMsg::Bank(BankMsg::Send{
        from_address: env.contract.address.to_string(),
        to_address: info.sender.to_string(),
        amount: vec![Coin {
            denom: msg.denom,
            amount: msg.amount.to_string(),
        }]}),
    };

    let mut messages = vec![creation_fee_msg, lock_funds_msg]

    // Ok(Response::new().add_attribute("action", "create_deal"))
    let response_data = to_binary(&CreateDealResponse { deal_id: id })?;
    Ok(Response::new().add_messages(messages).set_data(response_data)).add_attribute("action", "create_deal")
}

#[entry_point]
pub fn cancel_deal(deps: DepsMut, _env: Env, info: MessageInfo, msg: CancelDealMsg) -> StdResult<Response> {
    // Logic to retrieve and validate the deal
    // ...

    // Logic to cancel the deal and potentially refund bids
    // ...

    Ok(Response::new().add_attribute("action", "cancel_deal"))
}

#[entry_point]
pub fn place_bid(deps: DepsMut, _env: Env, info: MessageInfo, msg: PlaceBidMsg) -> StdResult<Response> {
        // owner authentication
        let config = CONFIG.load(deps.storage)?;

        // TODO
        // validate bid against deal token constraints
        // Check if bid_id exists
        let deal = get_deal(deps, msg.deal_id).unwrap();

        if deal.is_none() {
            return Err(StdError::generic_err("Deal does not exist"));
        }

        if deal.Status == "Active" {
            return Err(StdError::generic_err("Deal id does not match with the provided deal id"));
        }

        // Validate other fields
        if msg.denom != config.bid_denom {
            return Err(StdError::generic_err("Invalid bid denom"));
        }
        if msg.amount < config.min_bid_amount {
            return Err(StdError::generic_err("Bid amount is less than minimum bid amount"));
        }
        if msg.price < config.min_price {
            return Err(StdError::generic_err("Bid price is less than minimum price"));
        }

        let bid = Bid {
            bidder: info.sender.to_string(),
            denom: msg.denom,
            amount: msg.amount,
            price: msg.price,
        };
    
        // save the bid
        let bid_id = BID_SEQ.load(deps.storage)?;
        let bid_id = Uint64::new(bid_id).checked_add(Uint64::new(1))?.u64();
    
        BID_SEQ.save(deps.storage, &bid_id)?;
        BIDS.save(deps.storage, bid_id, bid)?;
    
    
        // msg for locking otc bid deposit in the contract
        let lock_funds_msg = MsgSend {
            from_address: env.contract.address.to_string(),
            to_address: info.sender.to_string(),
            amount: vec![Coin {
                denom: msg.denom,
                amount: msg.amount.to_string(),
            }],
        };
    
        let mut messages = vec![lock_funds_msg]
    
        // Ok(Response::new().add_attribute("action", "create_deal"))
        let response_data = to_binary(&CreateBidResponse { bid_id: bid_id })?;
        Ok(Response::new().add_messages(messages).set_data(response_data)).add_attribute("action", "place_bid")
}

#[entry_point]
pub fn withdraw_bid(deps: DepsMut, _env: Env, info: MessageInfo, msg: WithdrawBidMsg) -> StdResult<Response> {
    // Logic to validate and withdraw a bid
    // ...

    Ok(Response::new().add_attribute("action", "withdraw_bid"))
}

#[entry_point]
pub fn accept_bid(deps: DepsMut, _env: Env, info: MessageInfo, msg: AcceptBidMsg) -> StdResult<Response> {
    // Logic to validate deal and accept specified bids
    // ...

    Ok(Response::new().add_attribute("action", "accept_bid"))
}

#[entry_point]
pub fn execute_deal(deps: DepsMut, _env: Env, info: MessageInfo, msg: ExecuteDealMsg) -> StdResult<Response> {
    // Logic to execute the deal if conditions are met
    // ...

    Ok(Response::new().add_attribute("action", "execute_deal"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetDeal { id } => to_binary(&query_deal(deps, id)?),
    }
}

fn query_deal(deps: Deps, id: Uint64) -> StdResult<DealResponse> {
    let deal = DEALS.load(deps.storage, id.u64())?;
    Ok(deal)
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info, MOCK_CONTRACT_ADDR};
    use cosmwasm_std::{from_binary, Addr, CosmosMsg, WasmMsg};

    #[test]
    fn test_create_deal() {
        let mut deps = mock_dependencies();

        let msg = InstantiateMsg {
            admin: None,
            fee_collector: String::from("fee_addr"),
            fee_denom: String::from("uotc"),
            deal_creation_fee: 10,
            fee_percent: Decimal::percent(1),
        };
        let mut info = mock_info("sender", &[]);

        let _res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();

        let mut env = mock_env();
        env.block.height = 0;
        // should create deal
        let msg = ExecuteMsg::CreateDealMsg {
            deal_creator: info.sender.to_string(),
            deal_token_denom: String::from("uotc"),
            deal_token_amount: Uint128::new(100000),
            bid_token_denom: String::from("uusdc"),
            min_price: Decimal::percent(0),
            start_block: Uint128::new(1),
            end_block: Uint128::new(100),
            min_cap: Uint128::new(50),
        } => execute_create_deal(deps, env, info, );

        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
        assert_eq!(res, Err(ContractError::InvalidFeePercent {}));


        // query deal
        let msg = QueryMsg::GetDeal { id: Uint64::new(1) };
        let res = query(deps.as_ref(), mock_env(), msg).unwrap();

        let deal: Deal = from_binary(&res).unwrap();
        assert_eq!(
            deal,
            Deal {
                deal_creator: info.sender.to_string(),
                deal_token_denom: String::from("uotc"),
                deal_token_amount: Uint128::new(100000),
                bid_token_denom: String::from("uusdc"),
                min_price: Decimal::percent(0),
                start_block: Uint128::new(1),
                end_block: Uint128::new(100),
                min_cap: Uint128::new(50),
                
            }
        );
    }

    // #[test]
    // fn test_receive_send() {
    //     let mut deps = mock_dependencies();

    //     let msg = InstantiateMsg {
    //         admin: None,
    //         cw20_addr: String::from("cw20"),
    //     };
    //     let mut info = mock_info("creator", &[]);

    //     let _res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();

    //     // should create pot
    //     let msg = ExecuteMsg::CreatePot {
    //         target_addr: String::from("some"),
    //         threshold: Uint128::new(100),
    //     };
    //     let res = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
    //     assert_eq!(res.messages.len(), 0);

    //     let msg = ExecuteMsg::Receive(Cw20ReceiveMsg {
    //         sender: String::from("cw20"),
    //         amount: Uint128::new(55),
    //         msg: to_binary(&ReceiveMsg::Send { id: Uint64::new(1) }).unwrap(),
    //     });
    //     info.sender = Addr::unchecked("cw20");
    //     let _res = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();

    //     // query pot
    //     let msg = QueryMsg::GetPot { id: Uint64::new(1) };
    //     let res = query(deps.as_ref(), mock_env(), msg).unwrap();

    //     let pot: Pot = from_binary(&res).unwrap();
    //     assert_eq!(
    //         pot,
    //         Pot {
    //             target_addr: Addr::unchecked("some"),
    //             collected: Uint128::new(55),
    //             threshold: Uint128::new(100)
    //         }
    //     );

    //     let msg = ExecuteMsg::Receive(Cw20ReceiveMsg {
    //         sender: String::from("cw20"),
    //         amount: Uint128::new(55),
    //         msg: to_binary(&ReceiveMsg::Send { id: Uint64::new(1) }).unwrap(),
    //     });
    //     let res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
    //     let msg = res.messages[0].clone().msg;
    //     assert_eq!(
    //         msg,
    //         CosmosMsg::Wasm(WasmMsg::Execute {
    //             contract_addr: String::from("cw20"),
    //             msg: to_binary(&Cw20ExecuteMsg::Transfer {
    //                 recipient: String::from("some"),
    //                 amount: Uint128::new(110)
    //             })
    //             .unwrap(),
    //             funds: vec![]
    //         })
    //     );

    //     // query pot
    //     let msg = QueryMsg::GetPot { id: Uint64::new(1) };
    //     let res = query(deps.as_ref(), mock_env(), msg).unwrap();

    //     let pot: Pot = from_binary(&res).unwrap();
    //     assert_eq!(
    //         pot,
    //         Pot {
    //             target_addr: Addr::unchecked("some"),
    //             collected: Uint128::new(110),
    //             threshold: Uint128::new(100)
    //         }
    //     );
    // }
}
