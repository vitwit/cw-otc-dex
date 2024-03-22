#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::Coin;
use crate::msg::*;
use cw_storage_plus::Map;
use cosmwasm_std::coins;
use cosmwasm_std::{
    from_binary, to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult,
    Uint128, Uint64, StdError, Decimal, BankMsg,
};
use std::ops::Add;
use cw2::{get_contract_version, set_contract_version};
// use semver::Version;
use crate::state::*;
use crate::error::ContractError;
use crate::state::{ Config, Deal, DEALSTORE, CONFIG, DEALS, DEAL_SEQ};

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

    DEAL_SEQ.save(deps.storage,&0u64)?;
    BID_SEQ.save(deps.storage,&0u64)?;
    

    // fee percent must be less than 1 and greater than 0
    if msg.fee_percent >= Decimal::one() || msg.fee_percent < Decimal::zero() {
         println!("error occureed");
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
    let owner: Option<String>=msg.admin;
    let _owner = owner.unwrap_or("default".to_string());
    CONFIG.save(deps.storage, &config)?;
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner",_owner)
        .add_attribute("addr", msg.fee_collector))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response,ContractError> {
    match msg {
        ExecuteMsg::CreateDeal(create_deal_msg) => {
            execute_create_deal(deps, env, info, create_deal_msg)
        },
        ExecuteMsg::PlaceBid(place_bid_msg)=> execute_place_bid(deps, env, info,place_bid_msg),
        ExecuteMsg::ExecuteDeal(execute_deal_msg)=> execute_deal(deps, env, info,execute_deal_msg),
        ExecuteMsg::CancelDeal(cancel_deal_msg) => {
            execute_cancel_deal(deps, env,info,cancel_deal_msg)
        },
        ExecuteMsg::WithdrawBid(withdraw_bid_msg) => {
            withdraw_bid(deps, env, info, withdraw_bid_msg)
        }
        _=>todo!()
    }
}

// Function to check the balance of an address for a given denom
pub fn check_balance(deps: Deps, address: &str, denom: &str) -> StdResult<Uint128> {
    let query_result = deps.querier.query_balance(address, denom);

    // Handle the query result
    match query_result {
        Ok(balance) => Ok(balance.amount),
        Err(err) => {
            // Handle query error (e.g., address not found, denom not found, etc.)
            Err(err)
        }
    }
}
// Entry points for the message implementations
pub fn execute_create_deal(deps: DepsMut, _env: Env, info: MessageInfo, msg: CreateDealMsg) -> Result<Response,ContractError> {
    // owner authentication
    let config = CONFIG.load(deps.storage)?;
    
    if msg.start_block > msg.end_block{
        return Err(ContractError::InvalidDealCreation{});
    }
    let deal = Deal {
        deal_creator: Addr::unchecked(msg.deal_creator),
        /// min_cap is the token threshold amount to begin swaps
        min_cap: msg.min_cap,
        /// total_bid keeps information on how much is the total bid for this deal.
        total_bid:msg.total_bid,
        deal_token_denom: msg.deal_token_denom.clone(),
        deal_token_amount:msg.deal_token_amount,
        start_block:msg.start_block,
        end_block:msg.end_block,
        bid_token_denom: msg.bid_token_denom,
        min_price: msg.min_price,
    };
    // increment id if exists, or return 1
    let mut id = DEAL_SEQ.load(deps.storage)?;
    id+=1;
    DEAL_SEQ.save(deps.storage, &id)?;
    let res=DEALS.save(deps.storage, id, &deal);
    let creation_fee_msg = BankMsg::Send {
        to_address: config.fee_collector.to_string(),
        amount: vec![Coin {
            denom: config.deal_creation_fee_denom,
            amount: config.deal_creation_fee.into(),
        }],
    };
    println!("contract address is {:?}",_env.contract.address.to_string());
    // msg for locking otc deposit in the contract
    let lock_funds_msg: BankMsg = BankMsg::Send{
        to_address: _env.contract.address.to_string(),
        amount: vec![Coin {
            denom: msg.deal_token_denom,
            amount: msg.deal_token_amount,
        }]};
    
    let messages = vec![creation_fee_msg,lock_funds_msg];
    let response=Response::new().add_messages(messages).add_attribute("action", "create_deal");
    Ok(response)
}



pub fn execute_cancel_deal(deps: DepsMut, _env: Env, info: MessageInfo, msg: CancelDealMsg) -> Result<Response,ContractError> {
    // Logic to retrieve and validate the deal
    // ...
    let query_deal = DEALS.load(deps.storage, msg.deal_id);
    let _dealinfo=match query_deal{
    Ok(_dealinfo)=>_dealinfo,
        Err(_err)=> return Err(ContractError::DealNotExisted {  }),
    };
    if _dealinfo.deal_creator!= info.sender {
          return Err(ContractError::InvalidDealCreator {});
    }
    let mut _messages = Vec::new();
    let deal_token_amount_msg: BankMsg = BankMsg::Send{
        to_address: _dealinfo.deal_creator.to_string(),
        amount: vec![Coin {
            denom:_dealinfo.deal_token_denom.to_string(),
            amount: _dealinfo.deal_token_amount,
     }]};
     // Accumulate bidder amount messages
    _messages.push(deal_token_amount_msg);
    let bitstore_info_query=DEALSTORE.load(deps.storage,msg.deal_id);
    let bitstore_info = match bitstore_info_query {
        Ok(bitstore_info) => bitstore_info,
        Err(_err) => return Err(ContractError::BidStoreNotFound{}), // Return error if bitstore is not found
    };
    println!("bitstore is{:?}",bitstore_info);

    for (index, bid) in bitstore_info.bids.iter().enumerate() {
    let amount = bid.1.amount;
    let denom = bid.1.denom.clone();
    let bidder = bid.1.bidder.clone(); 
  
    let bidder_amount_msg: BankMsg = BankMsg::Send{
         to_address: bidder.to_string(),
             amount: vec![Coin {
            denom:denom,
            amount: amount,
         }]};
        _messages.push(bidder_amount_msg); 
    }
    DEALS.remove(deps.storage,msg.deal_id);
    // Return successful response
    Ok(Response::new().add_messages(_messages).add_attribute("action", "cancel_deal"))
}


pub fn execute_place_bid(deps: DepsMut, _env: Env, info: MessageInfo, msg: PlaceBidMsg) -> Result<Response,ContractError> {
        let bid= Bid {
            bidder:Addr::unchecked(msg.bidder),
            amount:msg.amount,
            denom:msg.denom.clone(),
            price:msg.price,
        };
        let res=DEALS.has(deps.storage,msg.deal_id);
        if res==false{
            return Err(ContractError::DealNotExisted{})
        }
        let mut deal=  DEALS.load(deps.storage,msg.deal_id)?;
        let end_block_height=_env.block.height;
        println!("block height is {}",end_block_height);
        // if end_block_height >= deal.end_block as u64 {
        //      return Err(ContractError::DealClosedForBidding{});
        // }
        if deal.bid_token_denom!=msg.denom{
            return Err(ContractError::DenomNotMatched{})
        }
        if msg.price < deal.min_price {
            return Err(ContractError::MinimumPriceNotSatisfied{})
        }
        let mut bid_store = DEALSTORE.may_load(deps.storage,msg.deal_id)?;
        //Generating the unique bid_id
        let bid_id = BID_SEQ.update::<_,StdError>(deps.storage, |bid_id| Ok(bid_id.add(1)))?;
        deal.total_bid=deal.total_bid+msg.amount;
        let _res=DEALS.save(deps.storage, msg.deal_id, &deal);
        if let Some(mut store) = bid_store {
            store.bids.push((bid_id,bid));
            DEALSTORE.save(deps.storage,msg.deal_id, &store)?;
        } else {
            let mut new_store = BidStore { bids: vec![]};
            new_store.bids.push((bid_id,bid));
            DEALSTORE.save(deps.storage,msg.deal_id, &new_store)?;
        }
        //to know the updated bid_store_list
        let bid_store_updated= DEALSTORE.may_load(deps.storage,msg.deal_id)?;
        // msg for locking bid deposit in the contract
        let lock_funds_msg: BankMsg = BankMsg::Send{
        // from_address: info.sender().to_string(),
        to_address: _env.contract.address.to_string(),
        amount: vec![Coin {
            denom: msg.denom,
            amount: msg.amount,
        }]};
        let messages = vec![lock_funds_msg];
        Ok(Response::new().add_messages(messages).add_attribute("action", "place_bid").add_attribute("bid_id",bid_id.to_string()))
}


pub fn withdraw_bid(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: WithdrawBidMsg,
) -> Result<Response,ContractError> {

    let res=DEALS.has(deps.storage,msg.deal_id);
    if res==false{
        return Err(ContractError::DealNotExisted{})
    }
    let mut deal=  DEALS.load(deps.storage,msg.deal_id)?;
    let end_block_height=Uint128::from(_env.block.height);
    // if end_block_height >= deal.end_block {
    //      return Err(ContractError::CannotWithdrawBid{});
    // }
    // Read DEALSTORE from storage
    let mut deal_store = DEALSTORE.load(deps.storage, msg.deal_id)?;
    // Check if the bid_id is present in the bid_store
    if let Some(index) = deal_store.bids.iter().position(|(bid_id, _)| *bid_id == msg.bid_id) {
        
        
        let mut bank_msgs=Vec::new();
        for (index, bid) in deal_store.bids.iter().enumerate() {
            let bid_amount = bid.1.amount;
            let denom = bid.1.denom.clone();
            let bidder = bid.1.bidder.clone();
            if(info.sender.as_str()!=bidder){
                return Err(ContractError::InvalidBidder {});
            }; 
           let lock_funds_msg: BankMsg = BankMsg::Send{
            // from_address: info.sender().to_string(),
            to_address: bidder.to_string(),
            amount: vec![Coin {
                denom: denom,
                amount: bid_amount,
            }]};
            bank_msgs.push(lock_funds_msg);
             deal.total_bid-=bid_amount;
             DEALS.save(deps.storage,msg.deal_id,&deal);
           } 
        // Remove bid from BidStore
        deal_store.bids.remove(index);
        // Update DEALSTORE in storage
        DEALSTORE.save(deps.storage, msg.deal_id, &deal_store)?;
        Ok(Response::new().add_messages(bank_msgs).add_attribute("action", "withdraw_bid"))
    } 
    else {
        Err(ContractError::BidIDNotFound{})
    }
 } 

pub fn calculate_total_bid_deposit(bids_store: &BidStore)->Uint128{
     let mut total_amount:Uint128=Uint128::new(0);
     for (_bid_id,bid) in bids_store.bids.iter(){
        total_amount+=bid.amount;
     }
     return total_amount;

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

pub fn refund_bids(bids_store: &mut BidStore,_info: MessageInfo,deal:Deal) ->Result<Response,ContractError>{
  
    let mut messages=Vec::new();
    for (_bid_id,bid) in bids_store.bids.iter(){
        //refunding to bidders
        let refund_to_bidder: BankMsg = BankMsg::Send{
            to_address: bid.bidder.to_string().clone(),
            amount: vec![Coin {
                denom: deal.bid_token_denom.clone(),
                amount: bid.amount,
        }]};
        messages.push(refund_to_bidder);
     }

    let refund_to_dealer= BankMsg::Send{
        to_address: deal.deal_creator.to_string().clone(),
        amount: vec![Coin {
            denom: deal.deal_token_denom.clone(),
            amount: deal.deal_token_amount,
    }]};
    messages.push(refund_to_dealer);
    Ok(Response::new().add_messages(messages).add_attribute("action", "refunded_bids and deal"))
}    

pub fn distribute_tokens(bids_store: &mut BidStore,total_bid_deposit:Uint128,deal_token_amount:Uint128, _info: MessageInfo,deal:Deal) ->Result<Response,ContractError>{
    let mut remaining_bid_deposit = total_bid_deposit;
    let mut remaining_deposit = deal_token_amount;
    let mut index = 0;
    let mut bid_transfer_messages=Vec::new();
    let mut deal_transfer_messages=Vec::new();
    let mut refund_messages=Vec::new();
    while index < bids_store.bids.len() {
        let (bid_id, bid) = &mut bids_store.bids[index];
        let transfer_amount = remaining_bid_deposit.min(remaining_deposit);
        if transfer_amount > Uint128::zero() {
            if bid.amount <= transfer_amount {
                // Update remaining amounts
                let transfer_to_bidder: BankMsg = BankMsg::Send{
                    to_address: bid.bidder.to_string().clone(),
                    amount: vec![Coin {
                        denom: deal.deal_token_denom.clone(),
                        amount:bid.amount,
                }]};                
                bid_transfer_messages.push(transfer_to_bidder);
                remaining_bid_deposit -= bid.amount;
                remaining_deposit -= bid.amount;
                // Remove successful bid from BidStore
                bids_store.bids.remove(index);

            } else {
                // Partial transfer to bidder
                let transfer_to_bidder: BankMsg = BankMsg::Send{
                    to_address: bid.bidder.to_string().clone(),
                    amount: vec![Coin {
                        denom: deal.deal_token_denom.clone(),
                        amount:transfer_amount,
                }]};
                bid_transfer_messages.push(transfer_to_bidder);
                 // Update bid amount
                bid.amount -= transfer_amount;
                remaining_bid_deposit -= transfer_amount;
                remaining_deposit -= transfer_amount;
                index += 1; // Move to the next bid
            }
        } else {
            // No more tokens to transfer
            index += 1; // Move to the next bid
        }
    }

    if remaining_bid_deposit > Uint128::zero(){
        for (_bid_id,bid) in bids_store.bids.iter(){
            //refunding to bidders
            let refund_to_bidder: BankMsg = BankMsg::Send{
                to_address: bid.bidder.to_string().clone(),
                amount: vec![Coin {
                    denom: deal.bid_token_denom.clone(),
                    amount: bid.amount,
            }]};
            refund_messages.push(refund_to_bidder);
         }
    }

    //transfering of bid_token_denoms to deal creator
    let transfer_to_dealer: BankMsg = BankMsg::Send{
        to_address: deal.deal_creator.to_string().clone(),
        amount: vec![Coin {
            denom: deal.bid_token_denom.clone(),
            amount:deal.total_bid.min(deal.deal_token_amount),
    }]};
    deal_transfer_messages.push(transfer_to_dealer);
    if remaining_deposit > Uint128::zero(){
          //refunding to deal_creator
          let refund_to_deal_creator: BankMsg = BankMsg::Send{
            to_address:deal.deal_creator.to_string().clone(),
            amount: vec![Coin {
                denom: deal.deal_token_denom.clone(),
                amount:remaining_deposit,
        }]};
        refund_messages.push(refund_to_deal_creator);
    }
    println!("Refund Messages looks like this{:?}",refund_messages);
    println!("Bid transfer Messages looks like this{:?}",bid_transfer_messages);
    println!("Deal transfer Messages looks like this{:?}",deal_transfer_messages);

    let all_messages = refund_messages
    .into_iter()
    .chain(bid_transfer_messages.into_iter())
    .chain(deal_transfer_messages.into_iter())
    .collect::<Vec<_>>();
    Ok(Response::new().add_messages(all_messages).add_attribute("action", "deal executed"))
}


pub fn execute_deal(deps: DepsMut, _env: Env, _info: MessageInfo, msg: ExecuteDealMsg) -> Result<Response,ContractError> {
    // Logic to execute the deal if conditions are met
    let query_deal=  DEALS.load(deps.storage,msg.deal_id);
    let deal = match query_deal {
        Ok(deal) => deal,
        Err(_err) => return Err( ContractError::DealNotExisted {}),
    };

    let end_block_height=Uint128::from(_env.block.height);
    // if end_block_height <= deal.end_block {
    //     println!("block height is {}",end_block_height);
    //      return Err(ContractError::DealTimeNotFulfilled{});
    // }

    
    let min_cap=deal.min_cap;
   // let mut bid_store = DEALSTORE.may_load(deps.storage, msg.deal_id)?;
        // Loading  bid store 
        let mut bid_store = match DEALSTORE.may_load(deps.storage, msg.deal_id)? {
            Some(store) => store,
            None => return Err(ContractError::BidStoreNotFound {}),
        };

        // Sort bid store by price descending
        sort_by_price_desc(&mut bid_store);
        println!("Sorted BidStore: {:?}", bid_store);

        // Calculate total bid deposit
        let total_bid_deposit = calculate_total_bid_deposit(&bid_store);
        println!("Total bid deposit is {}", total_bid_deposit);

        // Check if total bid deposit meets minimum capacity
        if deal.total_bid < min_cap.into() {
             let _res = refund_bids(&mut bid_store, _info.clone(), deal);
             DEALS.remove(deps.storage,msg.deal_id);
            return _res;
        }
        // Distribute tokens
        let _resp = distribute_tokens(&mut bid_store, deal.total_bid, deal.deal_token_amount, _info.clone(), deal);
        println!("After transferring the bid store looks like {:?}", bid_store);
         DEALS.remove(deps.storage,msg.deal_id);
        _resp.map_err(|e| ContractError::Std(e.into()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetDeal { id } => to_binary(&query_deal(deps, id)?),
        QueryMsg::GetBidStore { id }=>to_binary(&query_bid_store(deps,id)?),
        QueryMsg::GetBidDetails{id,bid_id}
        =>to_binary(&query_bid(deps,id,bid_id)?),
    }
}

fn query_bid_store(deps:Deps,id:Uint64)->StdResult<BidStoreResponse>{
    let bid_store = DEALSTORE.load(deps.storage, id.into())?;
    Ok(BidStoreResponse { bids: bid_store.bids })
}
fn query_deal(deps: Deps, id: Uint64) -> StdResult<DealResponse> {
    let deal = DEALS.load(deps.storage, id.u64())?;
    Ok(DealResponse{deal})
}

fn query_bid(deps:Deps,id:Uint64,bid_id:Uint64) -> StdResult<BidResponse>{
    let bid_store=DEALSTORE.load(deps.storage,id.u64())?;
      // Find the Bid with the specified bid_id in the loaded BidStore
    let bid = bid_store
    .bids
    .into_iter()
    .find(|(current_bid_id, _)| *current_bid_id == bid_id.u64())
    .map(|(_, bid)| bid).expect("REASON");// Construct and return BidResponse with the retrieved Bid
    Ok(BidResponse { bid })
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info, MOCK_CONTRACT_ADDR,MockQuerier};
    use cosmwasm_std::{from_binary, Addr, CosmosMsg, WasmMsg,attr,BankQuery};
    use cosmwasm_std::BalanceResponse;
    use cosmwasm_std::Querier;
    
    #[test]
    fn test_create_deal() {
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
        let value=info.sender.to_string();
        let msg = InstantiateMsg {
            admin: Some(value),
            fee_collector: String::from("fee_addr"),
            fee_denom: String::from("uotc"),
            deal_creation_fee: 10,
            fee_percent: Decimal::percent(1),
        };
        let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
        assert_eq!(res.attributes,vec![attr("method", "instantiate"),
        attr("owner","sender"),attr("addr","fee_addr")]);
      
        let balance=check_balance(deps.as_ref(), "sender", "uotc");
        println!("before Balance -------{:?}",balance);
      //  should create deal
      let create_deal_msg = CreateDealMsg {
        deal_creator: Addr::unchecked(info.sender.to_string()),
        min_cap: Uint128::new(100),
        total_bid: Uint128::new(0),
        deal_token_denom: "token_denom".to_string(),
        deal_token_amount: Uint128::new(1000),
        start_block: Uint128::new(1000),
        end_block: Uint128::new(2000),
        bid_token_denom: "bid_token_denom".to_string(),
        min_price: Decimal::from_ratio(0u128, 2u128),
    };
    let msg = ExecuteMsg::CreateDeal(create_deal_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
       // query deal
     let balance=check_balance(deps.as_ref(), "fee_", "uotc");
        let msg = QueryMsg::GetDeal { id: Uint64::new(1) };
        let res = query(deps.as_ref(), mock_env(), msg).unwrap();
        let deal:DealResponse=from_binary(&res).unwrap();
        let dealresp=Deal{
                deal_creator: Addr::unchecked("sender"),
                min_cap: Uint128::new(100),
                total_bid: Uint128::new(0),
                deal_token_denom: "token_denom".to_string(),
                deal_token_amount: Uint128::new(1000),
                start_block: Uint128::new(1000),
                end_block: Uint128::new(2000),
                bid_token_denom: "bid_token_denom".to_string(),
                min_price: Decimal::from_ratio(0u128, 2u128),   
            };
        let deal_response = DealResponse {
                deal: dealresp,
        };
        assert_eq!(
            deal,
            deal_response
        );
    }

   #[test]
    fn test_place_bid() {
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
          let value=info.sender.to_string();
          let msg = InstantiateMsg {
              admin: Some(value),
              fee_collector: String::from("fee_addr"),
              fee_denom: String::from("uotc"),
              deal_creation_fee: 10,
              fee_percent: Decimal::percent(1), 
          };
          let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
          assert_eq!(res.attributes,vec![attr("method", "instantiate"),
          attr("owner","sender"),attr("addr","fee_addr")]);
        
          let balance=check_balance(deps.as_ref(), "sender", "uotc");
          println!("before Balance -------{:?}",balance);
        //  should create deal
        let create_deal_msg = CreateDealMsg {
          deal_creator: Addr::unchecked(info.sender.to_string()),
          min_cap: Uint128::new(100),
          total_bid: Uint128::new(0),
          deal_token_denom: "token_denom".to_string(),
          deal_token_amount: Uint128::new(1000),
          start_block: Uint128::new(1000),
          end_block: Uint128::new(2000),
          bid_token_denom: "bid_token_denom".to_string(),
          min_price: Decimal::from_ratio(0u128, 2u128),
      };
      let msg = ExecuteMsg::CreateDeal(create_deal_msg);
      let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        

    let place_bid_msg = PlaceBidMsg {
        deal_id:1u64,
        bidder: Addr::unchecked(info.sender.to_string()),
        amount:Uint128::new(100),
        denom:"bid_token_denom".to_string(),
        price: Decimal::from_ratio(10u128, 2u128),
    };
    let msg = ExecuteMsg::PlaceBid(place_bid_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
    assert_eq!(res.attributes,vec![attr("action", "place_bid"),attr("bid_id", "1")]);
  
    let msg = QueryMsg::GetBidStore{ id: Uint64::new(1) };
    let res = query(deps.as_ref(), mock_env(), msg).unwrap();
    let bid_store:BidStore=from_binary(&res).unwrap();
    println!("queried bid store {:?}",bid_store);
    let mut bids:Vec<(u64,Bid)>=Vec::new();
    let bid_id=1u64;
    let bid_1=Bid{
         bidder:Addr::unchecked("sender"),
         amount:Uint128::new(100),
         denom:"bid_token_denom".to_string(),
         price:Decimal::from_ratio(10u128,2u128),
    };
    bids.push((bid_id,bid_1));
    assert_eq!(bid_store.bids,bids);
         //withdrawtest
    let withdraw_bid_msg = WithdrawBidMsg {
            bid_id: 1,
            deal_id: 1,
            bidder: Addr::unchecked("sender"),
    };
    let msg = ExecuteMsg::WithdrawBid(withdraw_bid_msg);

    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
      assert_eq!(res.attributes, vec![("action", "withdraw_bid")]);

      let msg = QueryMsg::GetDeal { id: Uint64::new(1) };
      let res = query(deps.as_ref(), mock_env(), msg).unwrap();
      let deal:DealResponse=from_binary(&res).unwrap();
      let dealresp=Deal{
              deal_creator: Addr::unchecked("sender"),
              min_cap: Uint128::new(100),
              total_bid: Uint128::new(0),
              deal_token_denom: "token_denom".to_string(),
              deal_token_amount: Uint128::new(1000),
              start_block: Uint128::new(1000),
              end_block: Uint128::new(2000),
              bid_token_denom: "bid_token_denom".to_string(),
              min_price: Decimal::from_ratio(0u128, 2u128),   
          };
      let deal_response = DealResponse {
              deal: dealresp,
      };
      assert_eq!(
          deal,
          deal_response
      );

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
          env.block.height = 50;
          let value=info.sender.to_string();
          let msg = InstantiateMsg {
              admin: Some(value),
              fee_collector: String::from("fee_addr"),
              fee_denom: String::from("uotc"),
              deal_creation_fee: 10,
              fee_percent: Decimal::percent(1),
          };
          let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
          assert_eq!(res.attributes,vec![attr("method", "instantiate"),
          attr("owner","sender"),attr("addr","fee_addr")]);
        
          let balance=check_balance(deps.as_ref(), "sender", "uotc");
        //  should create deal
        let create_deal_msg = CreateDealMsg {
          deal_creator: Addr::unchecked(info.sender.to_string()),
          min_cap: Uint128::new(700),
          total_bid: Uint128::new(0),
          deal_token_denom: "token_denom".to_string(),
          deal_token_amount: Uint128::new(500),
          start_block: Uint128::new(100),
          end_block: Uint128::new(200000),
          bid_token_denom: "bid_token_denom".to_string(),
          min_price: Decimal::from_ratio(0u128, 2u128),
      };
      let msg = ExecuteMsg::CreateDeal(create_deal_msg);
      let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        

    let place_bid_msg = PlaceBidMsg {
        deal_id:1u64,
        bidder: Addr::unchecked("user1"),
        amount:Uint128::new(100),
        denom:"bid_token_denom".to_string(),
        price: Decimal::from_ratio(10u128, 2u128),
    };
    let msg = ExecuteMsg::PlaceBid(place_bid_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
     //GetBidDetails
     let msg=QueryMsg::GetBidDetails { id: Uint64::new(1), bid_id: Uint64::new(1) };
     let res=query(deps.as_ref(),mock_env(),msg).unwrap();
     let bid_response: BidResponse = from_binary(&res).unwrap();
     let bid = bid_response.bid;
     assert_eq!(
         bid,
         Bid{
             bidder: Addr::unchecked("user1"),
             amount:Uint128::new(100),
             denom:"bid_token_denom".to_string(),
             price: Decimal::from_ratio(10u128, 2u128),
         }
     );
    let place_bid_msg = PlaceBidMsg {
        deal_id:1u64,
        bidder: Addr::unchecked("manu"),
        amount:Uint128::new(500),
        denom:"bid_token_denom".to_string(),
        price: Decimal::from_ratio(10u128, 2u128),
    };
    let msg = ExecuteMsg::PlaceBid(place_bid_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
    let place_bid_msg = PlaceBidMsg {
        deal_id:1u64,
        bidder: Addr::unchecked("higher"),
        amount:Uint128::new(100),
        denom:"bid_token_denom".to_string(),
        price: Decimal::from_ratio(1000u128, 3u128),
    };
    let msg = ExecuteMsg::PlaceBid(place_bid_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();

    let execute_deal_msg = ExecuteDealMsg {
        deal_id:1u64,
    };
    let msg = ExecuteMsg::ExecuteDeal(execute_deal_msg);
    let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
    // assert_eq!(res, ContractError::MinimumCapacityNotReached {});
    assert_eq!(res.attributes,vec![attr("action", "deal executed")]);
    // let cancel_deal_msg = CancelDealMsg {
    //         deal_id: 1u64,
    //         };
    //   let msg = ExecuteMsg::CancelDeal(cancel_deal_msg);
    //   let res = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
    //   assert_eq!(res.attributes, vec![attr("action", "cancel_deal")]);  
    }


}
