use cosmwasm_std::{
    DepsMut, Env, MessageInfo, Response, Deps, Order, to_binary, Binary,
    StdResult, Uint128, entry_point, CosmosMsg, Storage,
};
use cosmwasm_std::StdError;
use cw2::set_contract_version;
use cosmwasm_std::Addr;
use crate::error::ContractError;
use crate::msg::{
    ExecuteMsg, InstantiateMsg,
};
use crate::state::{Config, Deal, Bid, CONFIG, DEAL_COUNTER, DEALS, BIDS};
use crate::helpers::{
    create_token_transfer_msg, create_payment_msg, get_sorted_bids,
    validate_deal_times, calculate_platform_fee,
};

use crate::msg::{QueryMsg, DealResponse, DealsResponse, BidResponse, DealStatsResponse};
use cw_storage_plus::Bound;

/// Contract name and version info for migration
const CONTRACT_NAME: &str = "crates.io:cosmos-otc-platform";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

/// Initializes the contract with the specified configuration
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    // Validate platform fee percentage (must be between 0 and 10000)
    if msg.platform_fee_percentage > 10000 {
        return Err(ContractError::InvalidTimeParameters {
            reason: "Platform fee percentage must not exceed 100%".to_string(),
        });
    }

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let config = Config {
        platform_fee_percentage: msg.platform_fee_percentage,
    };
    
    CONFIG.save(deps.storage, &config)?;
    DEAL_COUNTER.save(deps.storage, &0u64)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

/// Handles all execute messages
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateDeal {
            sell_token,
            total_amount,
            min_price,
            discount_percentage,
            min_cap,
            bid_start_time,
            bid_end_time,
            conclude_time,
        } => execute_create_deal(
            deps,
            env,
            info,
            sell_token,
            total_amount,
            min_price,
            discount_percentage,
            min_cap,
            bid_start_time,
            bid_end_time,
            conclude_time,
        ),
        ExecuteMsg::PlaceBid {
            deal_id,
            amount,
            discount_percentage,
            max_price,
        } => execute_place_bid(deps, env, info, deal_id, amount, discount_percentage, max_price),
        ExecuteMsg::UpdateBid {
            deal_id,
            new_amount,
            new_discount_percentage,
            new_max_price,
        } => execute_update_bid(deps, env, info, deal_id, new_amount, new_discount_percentage, new_max_price),
        ExecuteMsg::WithdrawBid { deal_id } => execute_withdraw_bid(deps, env, info, deal_id),
        ExecuteMsg::ConcludeDeal { deal_id } => execute_conclude_deal(deps, env, info, deal_id),
    }
}

/// Creates a new OTC deal
pub fn execute_create_deal(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    sell_token: String,
    total_amount: Uint128,
    min_price: Uint128,
    discount_percentage: u64,
    min_cap: Uint128,
    bid_start_time: u64,
    bid_end_time: u64,
    conclude_time: u64,
) -> Result<Response, ContractError> {
    // Validate time parameters
    validate_deal_times(
        bid_start_time,
        bid_end_time,
        conclude_time,
        env.block.time.seconds(),
    )?;

    // Validate discount percentage
    if discount_percentage > 10000 {
        return Err(ContractError::InvalidTimeParameters {
            reason: "Discount percentage must not exceed 100%".to_string(),
        });
    }

    // Calculate and validate platform fee
    let config = CONFIG.load(deps.storage)?;
    let platform_fee = calculate_platform_fee(total_amount, config.platform_fee_percentage)?;
    
    // Ensure seller has sent enough platform fee
    let provided_fee = info
        .funds
        .iter()
        .find(|c| c.denom == "uusd") // Replace with your desired denomination
        .map(|c| c.amount)
        .unwrap_or_default();

    if provided_fee < platform_fee {
        return Err(ContractError::InsufficientPlatformFee {
            required: platform_fee.u128(),
            provided: provided_fee.u128(),
        });
    }

    // Create and save new deal
    let deal_id = DEAL_COUNTER.load(deps.storage)? + 1;
    DEAL_COUNTER.save(deps.storage, &deal_id)?;

    let deal = Deal {
        seller: info.sender.to_string(),
        sell_token,
        total_amount,
        min_price,
        discount_percentage,
        min_cap,
        bid_start_time,
        bid_end_time,
        conclude_time,
        is_concluded: false,
        total_bids_amount: Uint128::zero(),
    };

    DEALS.save(deps.storage, deal_id, &deal)?;

    Ok(Response::new()
        .add_attribute("method", "create_deal")
        .add_attribute("deal_id", deal_id.to_string())
        .add_attribute("seller", info.sender))
}

/// Places a new bid on an existing deal
pub fn execute_place_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    deal_id: u64,
    amount: Uint128,
    discount_percentage: u64,
    max_price: Option<Uint128>,
) -> Result<Response, ContractError> {
    let deal = DEALS.load(deps.storage, deal_id)?;
    
    // Validate bid timing
    let current_time = env.block.time.seconds();
    if current_time < deal.bid_start_time {
        return Err(ContractError::BiddingNotStarted {});
    }
    if current_time >= deal.bid_end_time {
        return Err(ContractError::BiddingEnded {});
    }

    // Validate bid amount
    if amount.is_zero() {
        return Err(ContractError::InvalidBidAmount {
            reason: "Bid amount must be greater than zero".to_string(),
        });
    }

    // Validate discount percentage
    if discount_percentage > 10000 {
        return Err(ContractError::InvalidBidAmount {
            reason: "Discount percentage must not exceed 100%".to_string(),
        });
    }

    let bid = Bid {
        bidder: info.sender.to_string(),
        amount,
        discount_percentage,
        max_price,
    };

    BIDS.save(deps.storage, (deal_id, &info.sender), &bid)?;
    
    // Update total bids amount
    let new_total = deal.total_bids_amount + amount;
    DEALS.update(deps.storage, deal_id, |deal_opt| -> StdResult<_> {
        let mut deal = deal_opt.unwrap();
        deal.total_bids_amount = new_total;
        Ok(deal)
    })?;

    Ok(Response::new()
        .add_attribute("method", "place_bid")
        .add_attribute("deal_id", deal_id.to_string())
        .add_attribute("bidder", info.sender)
        .add_attribute("amount", amount))
}

/// Updates an existing bid
pub fn execute_update_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    deal_id: u64,
    new_amount: Uint128,
    new_discount_percentage: u64,
    new_max_price: Option<Uint128>,
) -> Result<Response, ContractError> {
    let deal = DEALS.load(deps.storage, deal_id)?;
    
    // Validate timing
    if env.block.time.seconds() >= deal.bid_end_time {
        return Err(ContractError::BiddingEnded {});
    }

    // Load existing bid
    let old_bid = BIDS.load(deps.storage, (deal_id, &info.sender))?;
    
    // Update total bids amount
    let amount_diff = new_amount.checked_sub(old_bid.amount)?;
    DEALS.update(deps.storage, deal_id, |deal_opt| -> StdResult<_> {
        let mut deal = deal_opt.unwrap();
        deal.total_bids_amount = deal.total_bids_amount.checked_add(amount_diff)?;
        Ok(deal)
    })?;

    // Save updated bid
    let new_bid = Bid {
        bidder: info.sender.to_string(),
        amount: new_amount,
        discount_percentage: new_discount_percentage,
        max_price: new_max_price,
    };
    BIDS.save(deps.storage, (deal_id, &info.sender), &new_bid)?;

    Ok(Response::new()
        .add_attribute("method", "update_bid")
        .add_attribute("deal_id", deal_id.to_string())
        .add_attribute("bidder", info.sender))
}

/// Withdraws an existing bid
pub fn execute_withdraw_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    deal_id: u64,
) -> Result<Response, ContractError> {
    let deal = DEALS.load(deps.storage, deal_id)?;
    
    // Validate timing
    if env.block.time.seconds() >= deal.bid_end_time {
        return Err(ContractError::BiddingEnded {});
    }

    // Load and remove bid
    let bid = BIDS.load(deps.storage, (deal_id, &info.sender))?;
    BIDS.remove(deps.storage, (deal_id, &info.sender));

    // Update total bids amount
    DEALS.update(deps.storage, deal_id, |deal_opt| -> StdResult<_> {
        let mut deal = deal_opt.unwrap();
        deal.total_bids_amount = deal.total_bids_amount.checked_sub(bid.amount)?;
        Ok(deal)
    })?;

    Ok(Response::new()
        .add_attribute("method", "withdraw_bid")
        .add_attribute("deal_id", deal_id.to_string())
        .add_attribute("bidder", info.sender))
}

/// Concludes an OTC deal by processing all bids and distributing tokens
/// 
/// # Deal Conclusion Process
/// 1. Validates deal timing and status
/// 2. Checks if minimum cap is met
/// 3. If min cap not met: refunds all bidders
/// 4. If min cap met:
///    - Sorts bids by discount (lowest first)
///    - Processes bids until all tokens are allocated
///    - Transfers tokens to successful bidders
///    - Transfers payments to seller
///    - Refunds unsuccessful bidders
/// 
/// # Arguments
/// * `deps` - Mutable dependencies for storage access
/// * `env` - Environment variables, primarily used for time validation
/// * `_info` - Message information (unused but kept for consistency)
/// * `deal_id` - Identifier of the deal to conclude
/// 
/// # Returns
/// * `Response` - Success response with transfer messages and events
/// * `ContractError` - Various error conditions that might occur
pub fn execute_conclude_deal(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    deal_id: u64,
) -> Result<Response, ContractError> {
    // Load deal data
    let mut deal = DEALS.load(deps.storage, deal_id)?;
    
    // Validation: Check timing and conclusion status
    if env.block.time.seconds() < deal.conclude_time {
        return Err(ContractError::ConclusionTimeNotReached {});
    }
    if deal.is_concluded {
        return Err(ContractError::DealAlreadyConcluded {});
    }

    // Case 1: Minimum cap not met - refund all bidders
    if deal.total_bids_amount < deal.min_cap {
        let refund_messages = process_failed_deal(deps.storage, deal_id)?;
        
        // Mark deal as concluded
        deal.is_concluded = true;
        DEALS.save(deps.storage, deal_id, &deal)?;

        return Ok(Response::new()
            .add_messages(refund_messages)
            .add_attribute("method", "conclude_deal_refund")
            .add_attribute("deal_id", deal_id.to_string())
            .add_attribute("reason", "min_cap_not_met")
            .add_attribute("total_refunded", deal.total_bids_amount));
    }

    // Case 2: Process successful deal
    let (messages, stats) = process_successful_deal(
        deps.storage,
        &deal,
        deal_id,
    )?;

    // Mark deal as concluded
    deal.is_concluded = true;
    DEALS.save(deps.storage, deal_id, &deal)?;

    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("method", "conclude_deal")
        .add_attribute("deal_id", deal_id.to_string())
        .add_attribute("tokens_sold", stats.tokens_sold)
        .add_attribute("total_payment", stats.total_payment)
        .add_attribute("successful_bids", stats.successful_bids.to_string())
        .add_attribute("refunded_bids", stats.refunded_bids.to_string()))
}

/// Helper struct to track deal conclusion statistics
struct DealStats {
    tokens_sold: Uint128,
    total_payment: Uint128,
    successful_bids: u32,
    refunded_bids: u32,
}

/// Processes a failed deal by refunding all bidders
fn process_failed_deal(
    storage: &dyn Storage,
    deal_id: u64,
) -> Result<Vec<CosmosMsg>, ContractError> {
    let mut messages: Vec<CosmosMsg> = vec![];
    let bids = get_sorted_bids(storage, deal_id)?;

    for (bidder, bid) in bids {
        messages.push(create_payment_msg(
            bidder,
            bid.amount,
            "uusd", // Replace with actual denom
        ));
    }

    Ok(messages)
}

/// Processes a successful deal by allocating tokens and handling payments
fn process_successful_deal(
    storage: &dyn Storage,
    deal: &Deal,
    deal_id: u64,
) -> Result<(Vec<CosmosMsg>, DealStats), ContractError> {
    let mut messages: Vec<CosmosMsg> = vec![];
    let mut stats = DealStats {
        tokens_sold: Uint128::zero(),
        total_payment: Uint128::zero(),
        successful_bids: 0,
        refunded_bids: 0,
    };

    let mut remaining_tokens = deal.total_amount;
    let bids = get_sorted_bids(storage, deal_id)?;

    // Process bids from lowest to highest discount
    for (bidder, bid) in bids {
        if remaining_tokens.is_zero() {
            // Refund remaining bids
            messages.push(create_payment_msg(
                bidder,
                bid.amount,
                "uusd",
            ));
            stats.refunded_bids += 1;
            continue;
        }

        // Calculate token allocation
        let tokens_to_receive = std::cmp::min(bid.amount, remaining_tokens);
        
        // Calculate final price with discount
        let base_price = tokens_to_receive.multiply_ratio(deal.min_price, Uint128::new(1u128));
        let discount = base_price.multiply_ratio(bid.discount_percentage, 100u128);
        let final_price = base_price.checked_sub(discount)?;

        // Check if price meets buyer's max price constraint
        if let Some(max_price) = bid.max_price {
            if final_price > max_price {
                messages.push(create_payment_msg(
                    bidder,
                    bid.amount,
                    "uusd",
                ));
                stats.refunded_bids += 1;
                continue;
            }
        }

        // Process successful bid
        
        // 1. Transfer tokens to buyer
        messages.push(create_token_transfer_msg(
            deal.sell_token.clone(),
            bidder.clone(),
            tokens_to_receive,
        )?);

        // 2. Transfer payment to seller
        messages.push(create_payment_msg(
            deal.seller.clone(),
            final_price,
            "uusd",
        ));

        // Update running totals
        remaining_tokens = remaining_tokens.checked_sub(tokens_to_receive)?;
        stats.tokens_sold += tokens_to_receive;
        stats.total_payment += final_price;
        stats.successful_bids += 1;
    }

    // Validate all tokens are accounted for
    if stats.tokens_sold + remaining_tokens != deal.total_amount {
        return Err(ContractError::InvalidBidAmount { 
            reason: "Token allocation mismatch".to_string() 
        });
    }

    Ok((messages, stats))
}

const DEFAULT_LIMIT: u32 = 10;
const MAX_LIMIT: u32 = 30;

pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    let response = match msg {
        QueryMsg::GetDeal { deal_id } => to_binary(&query_deal(deps, deal_id)?),
        QueryMsg::ListDeals { start_after, limit } => to_binary(&list_deals(deps, start_after, limit)?),
        QueryMsg::GetBid { deal_id, bidder } => to_binary(&query_bid(deps, deal_id, bidder)?),
        QueryMsg::ListBidsForDeal { deal_id, start_after, limit } => {
            to_binary(&list_bids_for_deal(deps, deal_id, start_after, limit)?)
        },
        QueryMsg::ListDealsBySeller { seller, start_after, limit } => {
            to_binary(&list_deals_by_seller(deps, seller, start_after, limit)?)
        },
        QueryMsg::ListBidsByBidder { bidder, start_after, limit } => {
            to_binary(&list_bids_by_bidder(deps, bidder, start_after, limit)?)
        },
        QueryMsg::ListActiveDeals { start_after, limit } => {
            to_binary(&list_active_deals(deps, env, start_after, limit)?)
        },
        QueryMsg::ListDealsByStatus { is_concluded, start_after, limit } => {
            to_binary(&list_deals_by_status(deps, is_concluded, start_after, limit)?)
        },
        QueryMsg::GetConfig {} => to_binary(&query_config(deps)?),
        QueryMsg::GetDealStats { deal_id } => to_binary(&query_deal_stats(deps, env, deal_id)?),
    };
    Ok(response?)
}

// Update return types of query functions to use StdResult instead of Result<_, ContractError>
pub fn query_deal(deps: Deps, deal_id: u64) -> StdResult<DealResponse> {
    let deal = DEALS.load(deps.storage, deal_id)
        .map_err(|_| StdError::generic_err("Deal not found"))?;
    Ok(DealResponse { deal })
}

pub fn query_bid(
    deps: Deps, 
    deal_id: u64, 
    bidder: String,
) -> StdResult<BidResponse> {
    let addr = deps.api.addr_validate(&bidder)?;
    let bid = BIDS
        .load(deps.storage, (deal_id, &addr))
        .map_err(|_| StdError::generic_err("Bid not found"))?;
    Ok(BidResponse { bid })
}

pub fn list_bids_for_deal(
    deps: Deps,
    deal_id: u64,
    start_after: Option<String>,
    limit: Option<u32>,
) -> StdResult<Vec<BidResponse>> {
    // Check if deal exists
    DEALS.load(deps.storage, deal_id)
        .map_err(|_| StdError::generic_err("Deal not found"))?;

    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    
    // Convert start_after to validated address
    let start_addr = match start_after {
        Some(addr_str) => Some(deps.api.addr_validate(&addr_str)?),
        None => None,
    };

    let start_bound = start_addr.as_ref().map(|addr| {
        let bound_key = (deal_id, addr);
        Bound::exclusive(bound_key)
    });

    // Query bids
    let bids = BIDS
        .range(
            deps.storage,
            start_bound,
            Some(Bound::inclusive((deal_id + 1, &Addr::unchecked("")))),
            Order::Ascending,
        )
        .filter(|r| matches!(r, Ok((key, _)) if key.0 == deal_id))
        .take(limit)
        .map(|item| item.map(|(_, bid)| BidResponse { bid }))
        .collect::<StdResult<Vec<_>>>()?;

    Ok(bids)
}

pub fn list_deals(
    deps: Deps,
    start_after: Option<u64>,
    limit: Option<u32>,
) -> StdResult<DealsResponse> {
    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    let start = start_after.map(Bound::exclusive);

    let deals: StdResult<Vec<Deal>> = DEALS
        .range(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .map(|item| item.map(|(_, deal)| deal))
        .collect();

    Ok(DealsResponse { deals: deals? })
}

pub fn list_deals_by_seller(
    deps: Deps,
    seller: String,
    start_after: Option<u64>,
    limit: Option<u32>,
) -> StdResult<DealsResponse> {
    let seller_addr = deps.api.addr_validate(&seller)?;
    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    let start = start_after.map(Bound::exclusive);

    let deals: StdResult<Vec<Deal>> = DEALS
        .range(deps.storage, start, None, Order::Ascending)
        .filter(|r| match r {
            Ok((_, deal)) => deal.seller == seller_addr,
            Err(_) => true, // Keep errors to handle them in collect
        })
        .take(limit)
        .map(|item| item.map(|(_, deal)| deal))
        .collect();

    Ok(DealsResponse { deals: deals? })
}

pub fn list_bids_by_bidder(
    deps: Deps,
    bidder: String,
    start_after: Option<(u64, String)>,
    limit: Option<u32>,
) -> StdResult<Vec<(u64, BidResponse)>> {
    let bidder_addr = deps.api.addr_validate(&bidder)?;
    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    
    // Convert start_after into a proper bound
    let start = start_after
        .map(|(deal_id, _)| deal_id)
        .map(|id| (id, &bidder_addr));

    let mut bids = vec![];
    
    let bid_range = BIDS.range(
        deps.storage,
        start.map(Bound::exclusive),
        None,
        Order::Ascending,
    );

    for result in bid_range {
        let ((deal_id, addr), bid) = result?;
        if addr == bidder_addr {
            bids.push((deal_id, BidResponse { bid }));
            if bids.len() >= limit {
                break;
            }
        }
    }

    Ok(bids)
}

pub fn list_active_deals(
    deps: Deps,
    env: Env,
    start_after: Option<u64>,
    limit: Option<u32>,
) -> StdResult<DealsResponse> {
    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    let start = start_after.map(Bound::exclusive);
    let current_time = env.block.time.seconds();

    let deals: StdResult<Vec<Deal>> = DEALS
        .range(deps.storage, start, None, Order::Ascending)
        .filter(|r| match r {
            Ok((_, deal)) => {
                !deal.is_concluded && 
                deal.bid_start_time <= current_time && 
                deal.bid_end_time > current_time
            }
            Err(_) => true, // Keep errors to handle them in collect
        })
        .take(limit)
        .map(|item| item.map(|(_, deal)| deal))
        .collect();

    Ok(DealsResponse { deals: deals? })
}

pub fn list_deals_by_status(
    deps: Deps,
    is_concluded: bool,
    start_after: Option<u64>,
    limit: Option<u32>,
) -> StdResult<DealsResponse> {
    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    let start = start_after.map(Bound::exclusive);

    let deals: StdResult<Vec<Deal>> = DEALS
        .range(deps.storage, start, None, Order::Ascending)
        .filter(|r| match r {
            Ok((_, deal)) => deal.is_concluded == is_concluded,
            Err(_) => true, // Keep errors to handle them in collect
        })
        .take(limit)
        .map(|item| item.map(|(_, deal)| deal))
        .collect();

    Ok(DealsResponse { deals: deals? })
}

pub fn query_config(deps: Deps) -> StdResult<Config> {
    CONFIG.load(deps.storage)
}

pub fn query_deal_stats(
    deps: Deps,
    env: Env,
    deal_id: u64,
) -> StdResult<DealStatsResponse> {
    let deal = DEALS.load(deps.storage, deal_id)
        .map_err(|_| StdError::generic_err("Deal not found"))?;
    let current_time = env.block.time.seconds();

    let mut total_bids_count = 0u32;
    let mut total_discount = 0u64;
    let mut highest_bid_amount = Uint128::zero();
    let mut lowest_bid_amount = None;
    let mut total_bid_amount = Uint128::zero();
    let mut bidders = std::collections::HashSet::new();

    // Process all bids for the deal
    for result in BIDS.prefix(deal_id).range(deps.storage, None, None, Order::Ascending) {
        let (_, bid) = result?;
        total_bids_count += 1;
        total_discount += bid.discount_percentage;
        highest_bid_amount = std::cmp::max(highest_bid_amount, bid.amount);
        lowest_bid_amount = Some(lowest_bid_amount.map_or(bid.amount, |current| std::cmp::min(current, bid.amount)));
        total_bid_amount += bid.amount;
        bidders.insert(bid.bidder);
    }

    // Calculate time remaining if deal is active
    let time_remaining = if !deal.is_concluded && current_time < deal.conclude_time {
        Some(deal.conclude_time.saturating_sub(current_time))
    } else {
        None
    };

    let average_discount = if total_bids_count > 0 {
        total_discount / total_bids_count as u64
    } else {
        0
    };

    Ok(DealStatsResponse {
        total_bids_count,
        unique_bidders_count: bidders.len() as u32,
        average_discount,
        highest_bid_amount,
        lowest_bid_amount: lowest_bid_amount.unwrap_or_else(Uint128::zero),
        total_bid_amount,
        min_cap_reached: total_bid_amount >= deal.min_cap,
        time_remaining,
    })
}