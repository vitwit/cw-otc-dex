#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{ Coin, Order };
use std::convert::Into;
use std::ops::Add;
// use chrono::{NaiveDateTime, DateTime, Utc};
use cosmwasm_std::{Timestamp};
use crate::msg::*;
use cw_storage_plus::Map;
use cosmwasm_std::coins;
use cosmwasm_std::{
  from_binary,
  to_binary,
  Addr,
  Binary,
  Deps,
  DepsMut,
  Env,
  MessageInfo,
  Response,
  StdResult,
  Uint128,
  Uint64,
  StdError,
  Decimal,
  BankMsg,
};
use cw2::{ get_contract_version, set_contract_version };
use crate::error::ContractError;
use crate::state::{ Config, Deal, DEALSTORE, CONFIG, DEALS, DEAL_SEQ, BID_SEQ, Bid, BidStore };
use cosmwasm_storage::{ ReadonlyPrefixedStorage };
// use cosmwasm_std::{Deps, StdResult};
use cosmwasm_storage::{ PrefixedStorage };
use std::vec::Vec;
// version info for migration info
const CONTRACT_NAME: &str = "crates.io:cw-dotc";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
  deps: DepsMut,
  _env: Env,
  _info: MessageInfo,
  msg: InstantiateMsg
) -> Result<Response, ContractError> {
  set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

  DEAL_SEQ.save(deps.storage, &0u64)?;
  BID_SEQ.save(deps.storage, &0u64)?;

  // fee percent must be less than 1 and greater than 0
  if msg.fee_percent >= Decimal::one() || msg.fee_percent < Decimal::zero() {
    return Err(ContractError::InvalidFeePercent {});
  }

  if msg.deal_creation_fee == 0 {
    return Err(ContractError::InvalidDealCreationFee {});
  }
  let admin = msg.admin.clone().unwrap_or("".to_string());
  let config = Config {
    deal_creation_fee: msg.deal_creation_fee,
    deal_creation_fee_denom: msg.fee_denom,
    fee_percent: msg.fee_percent,
    fee_collector: deps.api.addr_validate(&msg.fee_collector)?,
    admin: deps.api.addr_validate(&admin)?,
  };
  let owner: Option<String> = msg.admin;
  let _owner = owner.unwrap_or("default".to_string());
  CONFIG.save(deps.storage, &config)?;
  Ok(
    Response::new()
      .add_attribute("method", "instantiate")
      .add_attribute("owner", _owner)
      .add_attribute("addr", msg.fee_collector)
  )
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
  deps: DepsMut,
  env: Env,
  info: MessageInfo,
  msg: ExecuteMsg
) -> Result<Response, ContractError> {
  match msg {
    ExecuteMsg::CreateDeal(create_deal_msg) => {
      execute_create_deal(deps, env, info, create_deal_msg)
    }
    ExecuteMsg::PlaceBid(place_bid_msg) => execute_place_bid(deps, env, info, place_bid_msg),
    ExecuteMsg::ExecuteDeal(execute_deal_msg) => execute_deal(deps, env, info, execute_deal_msg),
    ExecuteMsg::CancelDeal(cancel_deal_msg) => {
      execute_cancel_deal(deps, env, info, cancel_deal_msg)
    }
    ExecuteMsg::WithdrawBid(withdraw_bid_msg) => { withdraw_bid(deps, env, info, withdraw_bid_msg) }
    _ => todo!(),
  }
}

// Entry points for the message implementations
pub fn execute_create_deal(
  deps: DepsMut,
  _env: Env,
  info: MessageInfo,
  msg: CreateDealMsg
) -> Result<Response, ContractError> {
  let config = CONFIG.load(deps.storage)?;
  //making sure to create a deal with start block height is less than end block height
  if msg.start_block > msg.end_block.clone() {
    return Err(ContractError::InvalidDealCreation {});
  }

  //Checking whether start_block is less than network current block height or not
//   if msg.start_block < _env.block.height.into() {
//     return Err(ContractError::InvalidDealCreation {});
//   }

  //checking whether current height is not more than end block height to create a deal
  let end_block_height = _env.block.height;
  if end_block_height >= (msg.end_block as u64) {
    return Err(ContractError::InvalidEndBlock {});
  }
  //checking the signer is the deal creator address
  if info.sender != msg.deal_creator.clone() {
    return Err(ContractError::InvalidDealCreator {});
  }
  //creation of the deal
  let deal = Deal {
    deal_title: msg.deal_title,
    deal_description: msg.deal_description,
    deal_creator: Addr::unchecked(msg.deal_creator),
    min_cap: msg.min_cap,
    total_bid: msg.total_bid,
    deal_token_denom: msg.deal_token_denom.clone(),
    deal_token_amount: msg.deal_token_amount,
    start_block: msg.start_block,
    end_block: msg.end_block,
    bid_token_denom: msg.bid_token_denom,
    min_price: msg.min_price,
    deal_status:"Active".to_string(),
  };
  //Generating deal_id from the deal sequence
  let id = DEAL_SEQ.update::<_, StdError>(deps.storage, |id| Ok(id.add(1)))?;
  DEAL_SEQ.save(deps.storage, &id)?;
  let res = DEALS.save(deps.storage, id, &deal);

  //sending amount to the feecollector
  let creation_fee_msg = BankMsg::Send {
    to_address: config.fee_collector.to_string(),
    amount: vec![Coin {
      denom: config.deal_creation_fee_denom,
      amount: config.deal_creation_fee.into(),
    }],
  };

  // msg for locking otc deposit in the contract address
  let lock_funds_msg: BankMsg = BankMsg::Send {
    to_address: _env.contract.address.to_string(),
    amount: vec![Coin {
      denom: msg.deal_token_denom,
      amount: msg.deal_token_amount,
    }],
  };

  let messages = vec![creation_fee_msg, lock_funds_msg];
  let response = Response::new()
    .add_messages(messages)
    .add_attribute("action", "create_deal")
    .add_attribute("deal_id", id.to_string());
  Ok(response)
}

pub fn execute_cancel_deal(
  deps: DepsMut,
  _env: Env,
  info: MessageInfo,
  msg: CancelDealMsg
) -> Result<Response, ContractError> {
  // Logic to retrieve and validate the deal
  let query_deal = DEALS.load(deps.storage, msg.deal_id);
  let mut _dealinfo = match query_deal {
    Ok(_dealinfo) => _dealinfo,
    Err(_err) => {
      return Err(ContractError::DealNotExisted {});
    }
  };


  if(_dealinfo.deal_status=="Completed"){
    return Err(ContractError::DealExecuted {});
  }
  //checking whether the user is deal_creator or not
  if _dealinfo.deal_creator != info.sender {
    return Err(ContractError::InvalidDealCanceller {});
  }

  let mut _messages = Vec::new();
  //sending the dealtoken amount back to the dealcreator
  let deal_token_amount_msg: BankMsg = BankMsg::Send {
    to_address: _dealinfo.deal_creator.to_string(),
    amount: vec![Coin {
      denom: _dealinfo.deal_token_denom.to_string(),
      amount: _dealinfo.deal_token_amount,
    }],
  };
  _messages.push(deal_token_amount_msg);
  //retrieval of bids from respective deal_id
  let bidstore_info_query = DEALSTORE.load(deps.storage, msg.deal_id);
  let bidstore_info = match bidstore_info_query {
    Ok(bidstore_info) => bidstore_info,
    Err(_err) => {
        _dealinfo.deal_status="Completed".to_string();
        let _res = DEALS.save(deps.storage,msg.deal_id, &_dealinfo);
        return Err(ContractError::BidStoreNotFound {});
    } // Return error if bitstore is not found
  };

  //refunding the bids to the bidder
  for (index, bid) in bidstore_info.bids.iter().enumerate() {
    let amount = bid.1.amount;
    let denom = bid.1.denom.clone();
    let bidder = bid.1.bidder.clone();
    let price=bid.1.price.clone();
    let bidder_amount_msg: BankMsg = BankMsg::Send {
      to_address: bidder.to_string(),
      amount: vec![Coin {
        denom: denom,
        amount: amount*price,
      }],
    };
    _messages.push(bidder_amount_msg);
  }
//   //removal of the deal from deals

_dealinfo.deal_status="Completed".to_string();
  let _res = DEALS.save(deps.storage,msg.deal_id, &_dealinfo);

//   DEALS.remove(deps.storage, msg.deal_id);
    
  Ok(Response::new().add_messages(_messages).add_attribute("action", "cancel_deal"))
}

pub fn execute_place_bid(
  deps: DepsMut,
  _env: Env,
  info: MessageInfo,
  msg: PlaceBidMsg
) -> Result<Response, ContractError> {

  let timestamp= _env.block.time;

  let seconds: i64 = timestamp.seconds() as i64;
  let bid = Bid {
    bidder: Addr::unchecked(msg.bidder.clone()),
    amount: msg.amount,
    denom: msg.denom.clone(),
    price: msg.price,
    seconds:seconds,
  };
  if !DEALS.has(deps.storage, msg.deal_id) {
    return Err(ContractError::DealNotExisted {});
  }
  let mut deal = DEALS.load(deps.storage, msg.deal_id)?;
  //current height is already execeded the end block of deal we cannot able to place bid
  if _env.block.height >= (deal.end_block as u64) {
    return Err(ContractError::DealClosedForBidding {});
  }
  //making sure the bidder and signer are same
  if msg.bidder != info.sender {
    return Err(ContractError::InvalidBidderAddress {});
  }
  //checking bid denom with deal's bid token
  if deal.bid_token_denom != msg.denom {
    return Err(ContractError::DenomNotMatched {});
  }

  //making sure  bid price should be greater than or equal to minprice
  if msg.price < deal.min_price {
    return Err(ContractError::MinimumPriceNotSatisfied {});
  }
  //retriveal of bidstore of respective deal_id
  let mut bid_store = DEALSTORE.may_load(deps.storage, msg.deal_id)?;
  //Generating the unique bid_id
  let bid_id = BID_SEQ.update::<_, StdError>(deps.storage, |bid_id| Ok(bid_id.add(1)))?;
  //adding the bid value to the total bid
  deal.total_bid = deal.total_bid + msg.amount;
  let _res = DEALS.save(deps.storage, msg.deal_id, &deal);

  // initialize a new store if it's None, otherwise, use the existing store
  let mut store = bid_store.unwrap_or_else(|| BidStore { bids: vec![] });
  // push the bid into the store
  store.bids.push((bid_id, bid));
  // save the store
  DEALSTORE.save(deps.storage, msg.deal_id, &store)?;

  // msg for locking bid deposit in the contract
  let lock_funds_msg: BankMsg = BankMsg::Send {
    to_address: _env.contract.address.to_string(),
    amount: vec![Coin {
      denom: msg.denom,
      amount: msg.amount * msg.price,
    }],
  };
  let messages = vec![lock_funds_msg];
  Ok(
    Response::new()
      .add_messages(messages)
      .add_attribute("action", "place_bid")
      .add_attribute("bid_id", bid_id.to_string())
  )
}

pub fn withdraw_bid(
  deps: DepsMut,
  _env: Env,
  info: MessageInfo,
  msg: WithdrawBidMsg
) -> Result<Response, ContractError> {
  //Ckecking for Deal existance,return error if not exist
  if !DEALS.has(deps.storage, msg.deal_id) {
    return Err(ContractError::DealNotExisted {});
  }
  //Retrieving Deal
  let mut deal = DEALS.load(deps.storage, msg.deal_id)?;

  if _env.block.height >= (deal.end_block as u64) {
    return Err(ContractError::CannotWithdrawBid {});
  }
  //Loading BidStore from DEALSTORE to deal_store
  let mut deal_store = DEALSTORE.load(deps.storage, msg.deal_id)?;
  // Check if the bid_id is present in the bid_store(stored in deal_store)
  if let Some(index) = deal_store.bids.iter().position(|(bid_id, _)| *bid_id == msg.bid_id) {
    let mut bank_msgs = Vec::new();
    let bid_amount = deal_store.bids[index].1.amount;
    let denom = deal_store.bids[index].1.denom.clone();
    let bidder = deal_store.bids[index].1.bidder.clone();
    let price = deal_store.bids[index].1.price.clone();
    //checking whether the signer is matching with the bidder as per deal_id and bid_id
    if info.sender.as_str() != bidder {
      return Err(ContractError::InvalidBidder {});
    }
    //withdrawing the bid
    //sending bidder money back to bidder which is present in contract_address
    let lock_funds_msg: BankMsg = BankMsg::Send {
      to_address: bidder.to_string(),
      amount: vec![Coin {
        denom: denom,
        amount: bid_amount * price,
      }],
    };
    bank_msgs.push(lock_funds_msg);
    //Removing bid amount from the total bid
    deal.total_bid -= bid_amount;

    //Updating Deal details after withdrawing bid
    DEALS.save(deps.storage, msg.deal_id, &deal);
    // Remove bid from BidStore
    deal_store.bids.remove(index);
    // Update DEALSTORE in storage
    DEALSTORE.save(deps.storage, msg.deal_id, &deal_store)?;
    Ok(Response::new().add_messages(bank_msgs).add_attribute("action", "withdraw_bid"))
  } else {
    //Return error if bid_id not exist
    Err(ContractError::BidIDNotFound {})
  }
}

pub fn sort_by_price_desc(bids_store: &mut BidStore) {
  bids_store.bids.sort_by(|a, b| {
    let cmp_price = b.1.price.cmp(&a.1.price); // Compare prices in descending order
    if cmp_price == std::cmp::Ordering::Equal {
      a.0.cmp(&b.0) // If prices are equal, compare bid IDs in ascending order
    } else {
      cmp_price
    }
  });
}

pub fn refund_bids(
  bids_store: &mut BidStore,
  _info: MessageInfo,
  deal: Deal
) -> Result<Response, ContractError> {
  let mut messages = Vec::new();
  for (_bid_id, bid) in bids_store.bids.iter() {
    //refunding bids to bidders
    let refund_to_bidder: BankMsg = BankMsg::Send {
      to_address: bid.bidder.to_string().clone(),
      amount: vec![Coin {
        denom: deal.bid_token_denom.clone(),
        amount: bid.amount*bid.price,
      }],
    };
    messages.push(refund_to_bidder);
  }
  //refunding deal token amount back to the dealer
  let refund_to_dealer = BankMsg::Send {
    to_address: deal.deal_creator.to_string().clone(),
    amount: vec![Coin {
      denom: deal.deal_token_denom.clone(),
      amount: deal.deal_token_amount,
    }],
  };
  messages.push(refund_to_dealer);
  Ok(Response::new().add_messages(messages).add_attribute("action", "refunded_bids and deal"))
}

pub fn distribute_tokens(
  bids_store: &mut BidStore,
  total_bid_deposit: Uint128,
  deal_token_amount: Uint128,
  _info: MessageInfo,
  deal: Deal
) -> Result<Response, ContractError> {
  let mut remaining_bid_deposit = total_bid_deposit; //stores total bid deposit
  let mut remaining_deposit = deal_token_amount; //store the deal amount mentioned in the deal
  let mut index = 0;
  let mut bid_transfer_messages = Vec::new();
  let mut deal_transfer_messages = Vec::new();
  let mut refund_messages = Vec::new();
  //traversing through the bidstore and distributing tokens

  //traversing the bids and making sure the bid can be swapped
  //the total bid will be less than deal token amount or more than deal token amount
  //case 1::total bid is less than dealtoken amount then we have to swap amount of total_bid and refund remaining dealtoken amount to dealer
  //case 2::total bid is equal to dealtoken amount ,total bids will be swapped
  //case 3::total bid is greater than dealtoken amount,then we have to swap amount of deal_token amount with bid_token and refund remaining bids to bidder
  while index < bids_store.bids.len() {
    let (bid_id, bid) = &mut bids_store.bids[index];
    //we are taking minimum of  total_bid deposit and  deal_deposit
    let transfer_amount = remaining_bid_deposit.min(remaining_deposit);
    //if it is greater than zero we can have a transfer
    if transfer_amount > Uint128::zero() {
      //if a bid amount is less than transfer then we can swap a bid completely
      if bid.amount <= transfer_amount {
        //transfering the bid
        let transfer_to_bidder: BankMsg = BankMsg::Send {
          to_address: bid.bidder.to_string().clone(),
          amount: vec![Coin {
            denom: deal.deal_token_denom.clone(),
            amount: bid.amount,
          }],
        };
        bid_transfer_messages.push(transfer_to_bidder);
        //transfering of bid_token_denoms to deal creator
        let transfer_to_dealer: BankMsg = BankMsg::Send {
          to_address: deal.deal_creator.to_string().clone(),
          amount: vec![Coin {
            denom: deal.bid_token_denom.clone(),
            //we will transfer minimum of total_bid and deal_token_amount
            amount: bid.amount*bid.price,
          }],
        };
        deal_transfer_messages.push(transfer_to_dealer);
        remaining_bid_deposit -= bid.amount; //decreasing total bid
        remaining_deposit -= bid.amount; //decreasing deal token amount
        index+=1;
        // bids_store.bids.remove(index);
      } else {
         //bid amount is greater than transfer amount
        // Partial transfer to bidder with deal token and we will update the bid
        let transfer_to_bidder: BankMsg = BankMsg::Send {
          to_address: bid.bidder.to_string().clone(),
          amount: vec![Coin {
            denom: deal.deal_token_denom.clone(),
            amount: transfer_amount,
          }],
        };
        bid_transfer_messages.push(transfer_to_bidder);
        // Update bid amount
        bid.amount -= transfer_amount;
        remaining_bid_deposit -= transfer_amount; //decreasing total_bid by transfer amount

        let transfer_to_dealer: BankMsg = BankMsg::Send {
            to_address: deal.deal_creator.to_string().clone(),
            amount: vec![Coin {
              denom: deal.bid_token_denom.clone(),
              //we will transfer minimum of total_bid and deal_token_amount
              amount:  transfer_amount*bid.price,
            }],
          };
        deal_transfer_messages.push(transfer_to_dealer);
        remaining_deposit -= transfer_amount; //decreasing dealtoken amount by transfer amount
      }
    } else {
      // No more tokens to transfer so break
      break;
    }
  }
  //if total_bid is still left after swapping then refunding the bid amount to bidders
  if remaining_bid_deposit > Uint128::zero() {
    while index < bids_store.bids.len() {
      let (bid_id, bid) = &mut bids_store.bids[index];
      //refunding to bidders
      let refund_to_bidder: BankMsg = BankMsg::Send {
        to_address: bid.bidder.to_string().clone(),
        amount: vec![Coin {
          denom: deal.bid_token_denom.clone(),
          amount: bid.amount *bid.price,
        }],
      };
      refund_messages.push(refund_to_bidder);
      index+=1;
    }
  }
  //if deal_token_amount is left ,after swapping then refund it to the deal creator
  if remaining_deposit > Uint128::zero() {
    //refunding to deal_creator
    let refund_to_deal_creator: BankMsg = BankMsg::Send {
      to_address: deal.deal_creator.to_string().clone(),
      amount: vec![Coin {
        denom: deal.deal_token_denom.clone(),
        amount: remaining_deposit,
      }],
    };
    refund_messages.push(refund_to_deal_creator);
  }
  let all_messages = refund_messages
    .into_iter()
    .chain(bid_transfer_messages.into_iter())
    .chain(deal_transfer_messages.into_iter())
    .collect::<Vec<_>>();
  Ok(Response::new().add_messages(all_messages).add_attribute("action", "deal executed"))
}

pub fn execute_deal(
  deps: DepsMut,
  _env: Env,
  _info: MessageInfo,
  msg: ExecuteDealMsg
) -> Result<Response, ContractError> {
  // Logic to execute the deal if conditions are met
  let query_deal = DEALS.load(deps.storage, msg.deal_id);
  let mut deal = match query_deal {
    Ok(deal) => deal,
    Err(_err) => {
      return Err(ContractError::DealNotExisted {});
    }
  };

  if(deal.deal_status=="Completed"){
    return Err(ContractError::DealExecuted {});
  }
  //current height is less than end block height,so we can't execute deal
  if _env.block.height <= (deal.end_block as u64) {
    return Err(ContractError::DealTimeNotFulfilled {});
  }
  let min_cap = deal.min_cap;

  let mut bid_store = match DEALSTORE.may_load(deps.storage, msg.deal_id)? {
    Some(store) => store,
    None => {
      //no one bidded in the deal then we refund to the deal creator
      let mut messages = Vec::new();
      //refunding deal token amount back to the dealer
      let refund_to_dealer = BankMsg::Send {
        to_address: deal.deal_creator.to_string().clone(),
        amount: vec![Coin {
          denom: deal.deal_token_denom.clone(),
          amount: deal.deal_token_amount,
        }],
      };
      messages.push(refund_to_dealer);
      deal.deal_status="Completed".to_string();
      let _res = DEALS.save(deps.storage,msg.deal_id, &deal.clone());

      return Ok(
        Response::new()
          .add_messages(messages)
          .add_attribute("action", "refunded_deal and no bids are placed in this deal")
      );
    }
  };
  // Checking  if total bid deposit less than mindeposit then we refund deal and bids
  if deal.total_bid < min_cap.into() {
    let _res = refund_bids(&mut bid_store, _info.clone(), deal);
    DEALS.remove(deps.storage, msg.deal_id);
    return _res;
  }
  // Sort bid store by price descending order and bid id's
  sort_by_price_desc(&mut bid_store);
  // Distribute tokens
  let _resp = distribute_tokens(
    &mut bid_store,
    deal.total_bid,
    deal.deal_token_amount,
    _info.clone(),
    deal.clone()
  );
  deal.deal_status="Completed".to_string();
  let _res = DEALS.save(deps.storage,msg.deal_id, &deal);

//   DEALS.remove(deps.storage, msg.deal_id);
  _resp.map_err(|e| ContractError::Std(e.into()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
  match msg {
    QueryMsg::GetDeal { id } => to_binary(&query_deal(deps, id)?),
    QueryMsg::GetBidStore { id } => to_binary(&query_bid_store(deps, id)?),
    QueryMsg::GetBidDetails { id, bid_id } => to_binary(&query_bid(deps, id, bid_id)?),
    QueryMsg::GetAllDeals {} => to_binary(&query_all_deals(deps)?),
  }
}

fn query_all_deals(deps: Deps) -> StdResult<AllDealsResponse> {
  // Obtain keys from DEALS
  let keys_iter: Result<Vec<_>, _> = DEALS.keys(
    deps.storage,
    None,
    None,
    Order::Ascending
  ).collect();

  // Unwrap keys or return error if unwrapping fails
  let keys = keys_iter?;

  // Initialize an empty vector to store all deals
  let mut all_deals: Vec<(u64, Deal)> = Vec::new();

  // Iterate over the keys
  for key in keys {
    // Load the Deal associated with the key
    let deal = DEALS.load(deps.storage, key)?;

    // Push the key and Deal tuple to the vector
    all_deals.push((key, deal));
  }

  Ok(AllDealsResponse { deals: all_deals })
}

fn query_bid_store(deps: Deps, id: Uint64) -> StdResult<BidStoreResponse> {
  let bid_store = DEALSTORE.load(deps.storage, id.into())?;
  Ok(BidStoreResponse { bids: bid_store.bids })
}
fn query_deal(deps: Deps, id: Uint64) -> StdResult<DealResponse> {
  let deal = DEALS.load(deps.storage, id.u64())?;
  Ok(DealResponse { deal })
}

fn query_bid(deps: Deps, id: Uint64, bid_id: Uint64) -> StdResult<BidResponse> {
  let bid_store = DEALSTORE.load(deps.storage, id.u64())?;
  // Find the Bid with the specified bid_id in the loaded BidStore
  let bid = bid_store.bids
    .into_iter()
    .find(|(current_bid_id, _)| *current_bid_id == bid_id.u64())
    .map(|(_, bid)| bid)
    .expect("REASON"); // Construct and return BidResponse with the retrieved Bid
  Ok(BidResponse { bid })
}

#[cfg(test)]
mod tests {
  use super::*;
  use cosmwasm_std::testing::{
    mock_dependencies,
    mock_env,
    mock_info,
    MOCK_CONTRACT_ADDR,
    MockQuerier,
  };
  use cosmwasm_std::{ from_binary, Addr, CosmosMsg, WasmMsg, attr, BankQuery };
  use cosmwasm_std::BalanceResponse;
  use cosmwasm_std::Querier;



//   // Online Rust compiler to run Rust program online
// // Print "Try programiz.pro" message
// use chrono::{DateTime, NaiveDateTime, Utc};
// use cosmwasm_std::{Env, StdResult};

// fn get_current_date(env: &Env) -> StdResult<String> {
//     // Get the current timest
//     let timestamp= env.block.time;

//     let seconds: i64 = timestamp.seconds() as i64;

//     // Create a NaiveDateTime from the seconds
//     let naive_datetime = NaiveDateTime::from_timestamp(seconds, 0);

//     // Convert NaiveDateTime to DateTime<Utc>
//     let datetime: DateTime<Utc> = DateTime::from_utc(naive_datetime, Utc);

//     // Format the DateTime object into a string with the desired format
//     let formatted_date = datetime.format("%Y-%m-%d %H:%M:%S").to_string();

//     // Format the DateTime object into a string with the desired format
//     let formatted_date = datetime.format("%Y-%m-%d %H:%M:%S").to_string();

//     Ok(formatted_date)
// }
  #[test]  
  fn test_create_deal() {

  // This is just an example, in a real CosmWasm contract, you would obtain the `Env` from the function parameter
  
    //  let mut deps = mock_dependencies();
    let mut info = mock_info("sender", &[]);
    let mut deps = mock_dependencies(); // Initialize with empty storage
   
    // Initialize sender and recipient addresses
    let sender_address = Addr::unchecked("sender");
    let fee_collector_address = Addr::unchecked("fee_addr");

    // Initialize sender and fee collector balances
    deps.querier.update_balance(sender_address.clone(), coins(100, "uotc"));
    deps.querier.update_balance(fee_collector_address.clone(), coins(0, "uotc"));
    let mut env = mock_env();
    env.block.height = 0;
//     match get_current_date(&env) {
//       Ok(date) => println!("Current Date: {}", date),
//       Err(err) => eprintln!("Error: {:?}", err),
//   }

//     let current_time = env.block.time;
// println!("Current block time: {}", current_time);


// let timestamp = env.block.time;
// let seconds = timestamp.as_nanos() / 1_000_000_000;
// // Create a DateTime object from the seconds
// let datetime = DateTime::<Utc>::from_utc(NaiveDateTime::from_timestamp(seconds as i64, 0), Utc);

// // Format the DateTime object into a string with the desired format
// print!(datetime.format("%Y-%m-%d %H:%M:%S").to_string());
// println!("time stamp{:?}",timestamp);
// let naive = NaiveDateTime::from_timestamp(timestamp, 0);
// let datetime: DateTime<Utc> = DateTime::from_utc(naive, Utc);
// println!("Human-readable time: {}", datetime.format("%Y-%m-%d %H:%M:%S").to_string());
    let value = info.sender.to_string();
    let msg = InstantiateMsg {
      admin: Some(value),
      fee_collector: String::from("fee_addr"),
      fee_denom: String::from("uotc"),
      deal_creation_fee: 10,
      fee_percent: Decimal::percent(1),
    };
    let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
    assert_eq!(
      res.attributes,
      vec![attr("method", "instantiate"), attr("owner", "sender"), attr("addr", "fee_addr")]
    );
    //  should create deal
    let create_deal_msg = CreateDealMsg {
      deal_title: "osmo for exchange".to_string(),
      deal_description: "looking for buyers".to_string(),
      deal_creator: Addr::unchecked(info.sender.to_string()),
      min_cap: Uint128::new(100),
      total_bid: Uint128::new(0),
      deal_token_denom: "token_denom".to_string(),
      deal_token_amount: Uint128::new(1000),
      start_block: 10000,
      end_block: 20000,
      bid_token_denom: "bid_token_denom".to_string(),
      min_price: Decimal::from_ratio(0u128, 2u128),
    };
    let msg = ExecuteMsg::CreateDeal(create_deal_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
    let msg = QueryMsg::GetDeal { id: Uint64::new(1) };
    let res = query(deps.as_ref(), mock_env(), msg).unwrap();
    let deal: DealResponse = from_binary(&res).unwrap();
    let dealresp = Deal {
      deal_title: "osmo for exchange".to_string(),
      deal_description: "looking for buyers".to_string(),
      deal_creator: Addr::unchecked("sender"),
      min_cap: Uint128::new(100),
      total_bid: Uint128::new(0),
      deal_token_denom: "token_denom".to_string(),
      deal_token_amount: Uint128::new(1000),
      start_block: 10000,
      end_block: 20000,
      bid_token_denom: "bid_token_denom".to_string(),
      min_price: Decimal::from_ratio(0u128, 2u128),
      deal_status:"Active".to_string(),
    };
    let deal_response = DealResponse {
      deal: dealresp,
    };

    assert_eq!(deal, deal_response);

    let create_deal_msg = CreateDealMsg {
      deal_title: "osmo for exchange".to_string(),
      deal_description: "looking for buyers".to_string(),
      deal_creator: Addr::unchecked(info.sender.to_string()),
      min_cap: Uint128::new(100),
      total_bid: Uint128::new(0),
      deal_token_denom: "token_denom".to_string(),
      deal_token_amount: Uint128::new(1000),
      start_block: 100000,
      end_block: 2000000,
      bid_token_denom: "bid_token_denom".to_string(),
      min_price: Decimal::from_ratio(0u128, 2u128),
    };
    let msg = ExecuteMsg::CreateDeal(create_deal_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();

    let msg = QueryMsg::GetAllDeals {};
    let res = query(deps.as_ref(), mock_env(), msg).unwrap();
    // let deal: DealResponse = from_binary(&res).unwrap();
    // print!("deals are{:?}",deal);
  }

  #[test]
  fn test_place_bid_with_draw_bid() {
    //  let mut deps = mock_dependencies();
    let mut info = mock_info("sender", &[]);
    let mut deps = mock_dependencies(); // Initialize with empty storage

    // Initialize sender and recipient addresses
    let sender_address = Addr::unchecked("sender");
    let fee_collector_address = Addr::unchecked("fee_addr");
    // Initialize sender and fee collector balances
    deps.querier.update_balance(sender_address.clone(), coins(100, "uotc"));
    deps.querier.update_balance(fee_collector_address.clone(), coins(0, "uotc"));
    let mut env = mock_env();
    env.block.height = 0;
    let value = info.sender.to_string();
    let msg = InstantiateMsg {
      admin: Some(value),
      fee_collector: String::from("fee_addr"),
      fee_denom: String::from("uotc"),
      deal_creation_fee: 10,
      fee_percent: Decimal::percent(1),
    };
    let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
    assert_eq!(
      res.attributes,
      vec![attr("method", "instantiate"), attr("owner", "sender"), attr("addr", "fee_addr")]
    );
    //  should create deal
    let create_deal_msg = CreateDealMsg {
      deal_title: "osmo for exchange".to_string(),
      deal_description: "looking for buyers".to_string(),
      deal_creator: Addr::unchecked(info.sender.to_string()),
      min_cap: Uint128::new(100),
      total_bid: Uint128::new(0),
      deal_token_denom: "token_denom".to_string(),
      deal_token_amount: Uint128::new(1000),
      start_block: 10000,
      end_block: 20000,
      bid_token_denom: "bid_token_denom".to_string(),
      min_price: Decimal::from_ratio(0u128, 2u128),
    };
    let msg = ExecuteMsg::CreateDeal(create_deal_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();

    let place_bid_msg = PlaceBidMsg {
      deal_id: 1u64,
      bidder: Addr::unchecked(info.sender.to_string()),
      amount: Uint128::new(100),
      denom: "bid_token_denom".to_string(),
      price: Decimal::from_ratio(10u128, 2u128),
    };
    let msg = ExecuteMsg::PlaceBid(place_bid_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
    assert_eq!(res.attributes, vec![attr("action", "place_bid"), attr("bid_id", "1")]);

    let msg = QueryMsg::GetBidStore { id: Uint64::new(1) };
    let res = query(deps.as_ref(), mock_env(), msg).unwrap();
    let bid_store: BidStore = from_binary(&res).unwrap();
    let mut bids: Vec<(u64, Bid)> = Vec::new();
    let bid_id = 1u64;
    let bid_1 = Bid {
      bidder: Addr::unchecked("sender"),
      amount: Uint128::new(100),
      denom: "bid_token_denom".to_string(),
      price: Decimal::from_ratio(10u128, 2u128),
      seconds:64,
    };
    bids.push((bid_id, bid_1));
    assert_eq!(bid_store.bids, bids);

    let place_bid_msg = PlaceBidMsg {
      deal_id: 1u64,
      bidder: Addr::unchecked(info.sender.to_string()),
      amount: Uint128::new(500),
      denom: "bid_token_denom".to_string(),
      price: Decimal::from_ratio(10u128, 2u128),
    };

    let msg = ExecuteMsg::PlaceBid(place_bid_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
    assert_eq!(res.attributes, vec![attr("action", "place_bid"), attr("bid_id", "2")]);

    //withdrawtest
    let withdraw_bid_msg = WithdrawBidMsg {
      bid_id: 2,
      deal_id: 1,
    };
    let msg = ExecuteMsg::WithdrawBid(withdraw_bid_msg);

    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
    assert_eq!(res.attributes, vec![("action", "withdraw_bid")]);

    let msg = QueryMsg::GetDeal { id: Uint64::new(1) };
    let res = query(deps.as_ref(), mock_env(), msg).unwrap();
    let deal: DealResponse = from_binary(&res).unwrap();
    let dealresp = Deal {
      deal_title: "osmo for exchange".to_string(),
      deal_description: "looking for buyers".to_string(),
      deal_creator: Addr::unchecked("sender"),
      min_cap: Uint128::new(100),
      total_bid: Uint128::new(100),
      deal_token_denom: "token_denom".to_string(),
      deal_token_amount: Uint128::new(1000),
      start_block: 10000,
      end_block: 20000,
      bid_token_denom: "bid_token_denom".to_string(),
      min_price: Decimal::from_ratio(0u128, 2u128),
      deal_status:"Active".to_string(),
    };
    let deal_response = DealResponse {
      deal: dealresp,
    };
    assert_eq!(deal, deal_response);
  }

  #[test]
  fn test_execute_deal() {
    //  let mut deps = mock_dependencies();
    let mut info = mock_info("sender", &[]);
    let mut deps = mock_dependencies(); // Initialize with empty storage
    // Initialize sender and recipient addresses
    let sender_address = Addr::unchecked("sender");
    let fee_collector_address = Addr::unchecked("fee_addr");
    // Initialize sender and fee collector balances
    deps.querier.update_balance(sender_address.clone(), coins(100, "uotc"));
    deps.querier.update_balance(fee_collector_address.clone(), coins(0, "uotc"));
    let mut env = mock_env();
    env.block.height = 0;
    let value = info.sender.to_string();
    let msg = InstantiateMsg {
      admin: Some(value),
      fee_collector: String::from("fee_addr"),
      fee_denom: String::from("uotc"),
      deal_creation_fee: 10,
      fee_percent: Decimal::percent(1),
    };
    let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
    assert_eq!(
      res.attributes,
      vec![attr("method", "instantiate"), attr("owner", "sender"), attr("addr", "fee_addr")]
    );
    //  should create deal
    let create_deal_msg = CreateDealMsg {
      deal_title: "osmo for exchange".to_string(),
      deal_description: "looking for buyers".to_string(),
      deal_creator: Addr::unchecked(info.sender.to_string()),
      min_cap: Uint128::new(700),
      total_bid: Uint128::new(0),
      deal_token_denom: "token_denom".to_string(),
      deal_token_amount: Uint128::new(500),
      start_block: 100,
      end_block: 200000,
      bid_token_denom: "bid_token_denom".to_string(),
      min_price: Decimal::from_ratio(0u128, 2u128),
    };
    let msg = ExecuteMsg::CreateDeal(create_deal_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();

    let place_bid_msg = PlaceBidMsg {
      deal_id: 1u64,
      bidder: Addr::unchecked("sender"),
      amount: Uint128::new(100),
      denom: "bid_token_denom".to_string(),
      price: Decimal::from_ratio(10u128, 2u128),
    };
    let msg = ExecuteMsg::PlaceBid(place_bid_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
    //GetBidDetails
    let msg = QueryMsg::GetBidDetails { id: Uint64::new(1), bid_id: Uint64::new(1) };
    let res = query(deps.as_ref(), mock_env(), msg).unwrap();
    let bid_response: BidResponse = from_binary(&res).unwrap();
    let bid = bid_response.bid;
    assert_eq!(bid, Bid {
      bidder: Addr::unchecked("sender"),
      amount: Uint128::new(100),
      denom: "bid_token_denom".to_string(),
      price: Decimal::from_ratio(10u128, 2u128),
      seconds:64,
    });
    let place_bid_msg = PlaceBidMsg {
      deal_id: 1u64,
      bidder: Addr::unchecked("sender"),
      amount: Uint128::new(500),
      denom: "bid_token_denom".to_string(),
      price: Decimal::from_ratio(10u128, 2u128),
    };
    let msg = ExecuteMsg::PlaceBid(place_bid_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
    let place_bid_msg = PlaceBidMsg {
      deal_id: 1u64,
      bidder: Addr::unchecked("sender"),
      amount: Uint128::new(100),
      denom: "bid_token_denom".to_string(),
      price: Decimal::from_ratio(1000u128, 3u128),
    };
    let msg = ExecuteMsg::PlaceBid(place_bid_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();

    let execute_deal_msg = ExecuteDealMsg {
      deal_id: 1u64,
    };
    let msg = ExecuteMsg::ExecuteDeal(execute_deal_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
    assert_eq!(res.attributes, vec![attr("action", "deal executed")]);
  }

  #[test]
  fn test_cancel_deal() {
    //  let mut deps = mock_dependencies();
    let mut info = mock_info("sender", &[]);
    let mut deps = mock_dependencies(); // Initialize with empty storage
    // Initialize sender and recipient addresses
    let sender_address = Addr::unchecked("sender");
    let fee_collector_address = Addr::unchecked("fee_addr");
    // Initialize sender and fee collector balances
    deps.querier.update_balance(sender_address.clone(), coins(100, "uotc"));
    deps.querier.update_balance(fee_collector_address.clone(), coins(0, "uotc"));
    let mut env = mock_env();
    env.block.height = 50;
    let value = info.sender.to_string();
    let msg = InstantiateMsg {
      admin: Some(value),
      fee_collector: String::from("fee_addr"),
      fee_denom: String::from("uotc"),
      deal_creation_fee: 10,
      fee_percent: Decimal::percent(1),
    };
    let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
    assert_eq!(
      res.attributes,
      vec![attr("method", "instantiate"), attr("owner", "sender"), attr("addr", "fee_addr")]
    );
    //  should create deal
    let create_deal_msg = CreateDealMsg {
      deal_title: "osmo for exchange".to_string(),
      deal_description: "looking for buyers".to_string(),
      deal_creator: Addr::unchecked(info.sender.to_string()),
      min_cap: Uint128::new(700),
      total_bid: Uint128::new(0),
      deal_token_denom: "token_denom".to_string(),
      deal_token_amount: Uint128::new(500),
      start_block: 100,
      end_block: 200000,
      bid_token_denom: "bid_token_denom".to_string(),
      min_price: Decimal::from_ratio(0u128, 2u128),
    };
    let msg = ExecuteMsg::CreateDeal(create_deal_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();

    let place_bid_msg = PlaceBidMsg {
      deal_id: 1u64,
      bidder: Addr::unchecked("sender"),
      amount: Uint128::new(100),
      denom: "bid_token_denom".to_string(),
      price: Decimal::from_ratio(1000u128, 3u128),
    };
    let msg = ExecuteMsg::PlaceBid(place_bid_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
    let cancel_deal_msg = CancelDealMsg {
      deal_id: 1u64,
    };
    let msg = ExecuteMsg::CancelDeal(cancel_deal_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
    assert_eq!(res.attributes, vec![attr("action", "cancel_deal")]);
  }
}
