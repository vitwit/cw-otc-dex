use crate::contract::{execute, instantiate};
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg};
use crate::state::{BIDS, DEALS};
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{coins, Addr, DepsMut, Env, Order, Timestamp, Uint128};

#[cfg(test)]
mod tests {
    use super::*;

    const PLATFORM_FEE_PERCENTAGE: u64 = 100; // 1%
    const MOCK_SELL_TOKEN: &str = "token";
    const MOCK_PAYMENT_DENOM: &str = "uusdc";

    fn setup_contract(deps: DepsMut) {
        let msg = InstantiateMsg {
            platform_fee_percentage: PLATFORM_FEE_PERCENTAGE,
        };
        let info = mock_info("creator", &[]);
        let res = instantiate(deps, mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());
    }

    // Helper function to create mock environment with specified time
    fn mock_env_at_time(timestamp: u64) -> Env {
        let mut env = mock_env();
        env.block.time = Timestamp::from_seconds(timestamp);
        env
    }

    // Helper function to create a standard test deal message with future timestamps
    fn create_test_deal_msg(start_time: u64) -> ExecuteMsg {
        ExecuteMsg::CreateDeal {
            sell_token: MOCK_SELL_TOKEN.to_string(),
            bid_token_denom: "uusdc".to_string(),
            total_amount: Uint128::new(1000000u128),
            min_price: Uint128::new(1u128),
            discount_percentage: 1000, // 10%
            min_cap: Uint128::new(500000u128),
            bid_start_time: start_time + 1000, // Ensure future start
            bid_end_time: start_time + 2000,   // End time after start
            conclude_time: start_time + 3000,  // Conclude time after end
        }
    }

    #[test]
    fn test_place_bid() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create deal
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Place a bid
        let bid_env = mock_env_at_time(start_time + 1500); // During bidding period
        let bid_amount = Uint128::new(100000u128);

        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: None,
        };

        // Include bid payment in mock_info
        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info.clone(), bid_msg).unwrap();

        // Verify the bid
        let bid = BIDS
            .load(deps.as_ref().storage, (1, &Addr::unchecked("bidder1")))
            .unwrap();
        assert_eq!(bid.amount, bid_amount);
    }

    #[test]
    fn test_place_bid_before_bidding_starts() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create deal
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Attempt to place a bid before bidding starts
        let bid_env = mock_env_at_time(start_time + 500); // Before bidding period
        let bid_amount = Uint128::new(100000u128);

        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: Some(Uint128::new(95000u128)),
        };

        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        let err = execute(deps.as_mut(), bid_env.clone(), info, bid_msg).unwrap_err();
        assert!(matches!(err, ContractError::BiddingNotStarted {}));
    }

    #[test]
    fn test_place_bid_after_bidding_ends() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create deal
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Attempt to place a bid after bidding ends
        let bid_env = mock_env_at_time(start_time + 2500); // After bidding period
        let bid_amount = Uint128::new(100000u128);

        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: Some(Uint128::new(95000u128)),
        };

        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        let err = execute(deps.as_mut(), bid_env.clone(), info, bid_msg).unwrap_err();
        assert!(matches!(err, ContractError::BiddingEnded {}));
    }

    #[test]
    fn test_withdraw_bid() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create deal
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Place a bid
        let bid_env = mock_env_at_time(start_time + 1500); // During bidding period
        let bid_amount = Uint128::new(100000u128);
        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: None,
        };

        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info.clone(), bid_msg).unwrap();

        // Withdraw the bid
        let withdraw_msg = ExecuteMsg::WithdrawBid { deal_id: 1 };
        let res = execute(deps.as_mut(), bid_env.clone(), info.clone(), withdraw_msg).unwrap();
        assert_eq!(res.attributes.len(), 3);

        // Verify the bid is removed
        let bid = BIDS
            .may_load(deps.as_ref().storage, (1, &Addr::unchecked("bidder1")))
            .unwrap();
        assert!(bid.is_none());
    }

    #[test]
    fn test_withdraw_bid_after_bidding_ends() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create deal
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Place a bid
        let bid_env = mock_env_at_time(start_time + 1500); // During bidding period
        let bid_amount = Uint128::new(100000u128);
        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: None,
        };

        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info.clone(), bid_msg).unwrap();

        // Attempt to withdraw the bid after bidding ends
        let withdraw_env = mock_env_at_time(start_time + 2500); // After bidding period
        let withdraw_msg = ExecuteMsg::WithdrawBid { deal_id: 1 };
        let err = execute(
            deps.as_mut(),
            withdraw_env.clone(),
            info.clone(),
            withdraw_msg,
        )
        .unwrap_err();
        assert!(matches!(err, ContractError::BiddingEnded {}));
    }

    #[test]
    fn test_update_bid_after_bidding_ends() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create deal
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Place a bid
        let bid_env = mock_env_at_time(start_time + 1500); // During bidding period
        let bid_amount = Uint128::new(100000u128);
        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: None,
        };

        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info.clone(), bid_msg).unwrap();

        // Attempt to update the bid after bidding ends
        let update_env = mock_env_at_time(start_time + 2500); // After bidding period
        let update_msg = ExecuteMsg::UpdateBid {
            deal_id: 1,
            new_amount: Uint128::new(150000u128),
            new_discount_percentage: 600,
            new_max_price: None,
        };

        let err = execute(deps.as_mut(), update_env.clone(), info.clone(), update_msg).unwrap_err();
        assert!(matches!(err, ContractError::BiddingEnded {}));
    }

    #[test]
    fn test_place_bid_with_invalid_discount() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create deal
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Place a bid with invalid discount percentage
        let bid_env = mock_env_at_time(start_time + 1500); // During bidding period
        let bid_amount = Uint128::new(100000u128);
        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 11000, // Invalid: > 100%
            max_price: None,
        };

        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        let err = execute(deps.as_mut(), bid_env.clone(), info.clone(), bid_msg).unwrap_err();
        assert!(matches!(err, ContractError::InvalidBidAmount { .. }));
    }

    #[test]
    fn test_place_bid_with_zero_amount() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create deal
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Place a bid with zero amount
        let bid_env = mock_env_at_time(start_time + 1500); // During bidding period
        let bid_amount = Uint128::zero();

        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: None,
        };

        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        let err = execute(deps.as_mut(), bid_env.clone(), info.clone(), bid_msg).unwrap_err();
        assert!(matches!(err, ContractError::InvalidBidAmount { .. }));
    }

    #[test]
    fn test_bidder_can_bid_more_than_once() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create deal
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Place the first bid
        let bid_env = mock_env_at_time(start_time + 1500); // During bidding period
        let first_amount = Uint128::new(100000u128);
        let bid_msg1 = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: first_amount,
            discount_percentage: 500,
            max_price: None,
        };

        let info = mock_info("bidder1", &coins(first_amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info.clone(), bid_msg1).unwrap();

        // Attempt to place a second bid without updating
        let second_amount = Uint128::new(200000u128);
        let bid_msg2 = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: second_amount,
            discount_percentage: 600,
            max_price: None,
        };

        let info = mock_info("bidder1", &coins(second_amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info.clone(), bid_msg2).unwrap();

        // Verify all bids
        let bids: Vec<(String, Uint128)> = BIDS
            .prefix(1)
            .range(deps.as_ref().storage, None, None, Order::Ascending)
            .map(|item| {
                let (_, bid) = item.unwrap();
                (bid.bidder, bid.amount)
            })
            .collect();

        // Verify we have two bids
        assert_eq!(bids.len(), 2, "Should have two bids from the same bidder");

        // Verify both bids are from bidder1 with correct amounts
        assert_eq!(bids[0].0, "bidder1");
        assert_eq!(bids[0].1, first_amount);
        assert_eq!(bids[1].0, "bidder1");
        assert_eq!(bids[1].1, second_amount);

        // Verify total bids amount in deal
        let deal = DEALS.load(deps.as_ref().storage, 1).unwrap();
        assert_eq!(
            deal.total_bids_amount,
            first_amount + second_amount,
            "Total bid amount should be sum of both bids"
        );
    }
}
