use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{coins, Addr, BankMsg, CosmosMsg, DepsMut, Env, SubMsg, Timestamp, Uint128};

use crate::contract::{execute, instantiate};
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg};
use crate::state::{BIDS, DEALS};

#[cfg(test)]
pub mod tests {
    use super::*;

    const PLATFORM_FEE_PERCENTAGE: u64 = 100; // 1%
    const MOCK_SELL_TOKEN: &str = "token";
    const MOCK_PAYMENT_DENOM: &str = "uusdc";

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

    fn setup_contract(deps: DepsMut) {
        let msg = InstantiateMsg {
            platform_fee_percentage: PLATFORM_FEE_PERCENTAGE,
        };
        let info = mock_info("creator", &[]);
        let res = instantiate(deps, mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());
    }

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies();
        let msg = InstantiateMsg {
            platform_fee_percentage: PLATFORM_FEE_PERCENTAGE,
        };
        let info = mock_info("creator", &[]);
        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());
    }

    #[test]
    fn test_create_deal() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let current_time = 1000u64;
        let env = mock_env_at_time(current_time);
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let msg = create_test_deal_msg(current_time);

        // Test with insufficient platform fee
        let info = mock_info(
            "seller",
            &coins(platform_fee.u128() - 1, MOCK_PAYMENT_DENOM),
        );
        let err = execute(deps.as_mut(), env.clone(), info, msg.clone()).unwrap_err();
        assert!(matches!(err, ContractError::InsufficientPlatformFee { .. }));

        // Test successful deal creation
        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        let res = execute(deps.as_mut(), env.clone(), info, msg).unwrap();
        assert_eq!(res.attributes.len(), 3);

        let deal = DEALS.load(deps.as_ref().storage, 1).unwrap();
        assert_eq!(deal.seller, "seller");
        assert_eq!(deal.total_amount, total_amount);
        assert_eq!(deal.is_concluded, false);
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

        // Move to bidding period
        let bid_env = mock_env_at_time(start_time + 1500); // During bidding period
        let bid_amount = Uint128::new(100000u128);

        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: Some(Uint128::new(95000u128)),
        };

        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        let res = execute(deps.as_mut(), bid_env.clone(), info, bid_msg).unwrap();
        assert_eq!(res.attributes.len(), 4);

        let bid = BIDS
            .load(deps.as_ref().storage, (1, &Addr::unchecked("bidder1")))
            .unwrap();
        assert_eq!(bid.amount, Uint128::new(100000u128));
        assert_eq!(bid.discount_percentage, 500);
    }

    #[test]
    fn test_update_bid() {
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

        // Move to bidding period
        let bid_env = mock_env_at_time(start_time + 1500);
        let bid_amount = Uint128::new(100000u128);

        // Place initial bid
        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: Some(Uint128::new(95000u128)),
        };
        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info.clone(), bid_msg).unwrap();

        // Test bid update
        let bid_amount = Uint128::new(150000u128);
        let update_msg = ExecuteMsg::UpdateBid {
            deal_id: 1,
            new_amount: Uint128::new(150000u128),
            new_discount_percentage: 600,
            new_max_price: Some(Uint128::new(140000u128)),
        };

        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        let res = execute(deps.as_mut(), bid_env.clone(), info, update_msg).unwrap();
        assert_eq!(res.attributes.len(), 3);

        let bid = BIDS
            .load(deps.as_ref().storage, (1, &Addr::unchecked("bidder1")))
            .unwrap();
        assert_eq!(bid.amount, Uint128::new(150000u128));
        assert_eq!(bid.discount_percentage, 600);
    }

    #[test]
    fn test_conclude_deal() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create test deal
        let total_amount = Uint128::new(1000000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Add some bids (but below min_cap)
        let bid_env = mock_env_at_time(start_time + 1500);
        let bid_amount = Uint128::new(400000u128);

        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: None,
        };

        let info = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info, bid_msg).unwrap();

        // Move to conclusion time
        let conclude_env = mock_env_at_time(start_time + 3500);

        // Test failed deal (below min cap)
        let conclude_msg = ExecuteMsg::ConcludeDeal { deal_id: 1 };
        let info = mock_info("anyone", &[]);
        let res = execute(
            deps.as_mut(),
            conclude_env.clone(),
            info.clone(),
            conclude_msg.clone(),
        )
        .unwrap();

        assert!(res.messages.len() > 0);
        assert!(res
            .attributes
            .iter()
            .any(|attr| attr.value == "min_cap_not_met"));

        // Reset for successful conclusion test
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        // Create new deal
        let env = mock_env_at_time(start_time);
        // Create a new message instead of reusing the moved one
        let new_create_msg = create_test_deal_msg(start_time);
        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, new_create_msg).unwrap();

        // Move to bidding period and place bid meeting min_cap
        let bid_env = mock_env_at_time(start_time + 1500);
        let amount = Uint128::new(600000u128);
        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: amount,
            discount_percentage: 500,
            max_price: None,
        };
        let info = mock_info("bidder1", &coins(amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info, bid_msg).unwrap();

        // Test successful conclusion
        let info = mock_info("anyone", &coins(amount.u128(), MOCK_PAYMENT_DENOM));
        let res = execute(deps.as_mut(), conclude_env.clone(), info, conclude_msg).unwrap();

        assert!(res.messages.len() > 0);
        assert!(res.attributes.iter().any(|attr| attr.key == "tokens_sold"));
        assert!(res
            .attributes
            .iter()
            .any(|attr| attr.key == "total_payment"));
    }

    #[test]
    pub fn test_conclude_deal_min_cap_not_met() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        // Setup: Create a deal
        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        let total_amount = Uint128::new(1000000u128);
        let min_cap = Uint128::new(500000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info, create_msg).unwrap();

        // Add multiple bids that sum up to less than min_cap
        let bid_env = mock_env_at_time(start_time + 1500); // During bidding period
        let amount = Uint128::new(200000u128);
        // First bid
        let bid_msg1 = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: amount,
            discount_percentage: 500,
            max_price: None,
        };
        let info = mock_info("bidder1", &coins(amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info, bid_msg1).unwrap();

        let amount = Uint128::new(150000u128);
        // Second bid
        let bid_msg2 = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: amount,
            discount_percentage: 600,
            max_price: None,
        };
        let info = mock_info("bidder2", &coins(amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info, bid_msg2).unwrap();

        // Verify total bids amount is less than min_cap
        let deal = DEALS.load(deps.as_ref().storage, 1).unwrap();
        assert!(deal.total_bids_amount < min_cap);
        assert_eq!(deal.total_bids_amount, Uint128::new(350000u128));

        // Move to conclusion time and conclude the deal
        let conclude_time = start_time + 3500;
        let conclude_msg = ExecuteMsg::ConcludeDeal { deal_id: 1 };
        let info = mock_info("anyone", &[]);
        let res = execute(
            deps.as_mut(),
            mock_env_at_time(conclude_time),
            info,
            conclude_msg,
        )
        .unwrap();

        // Verify response
        assert!(res.messages.len() == 2); // Should have refund messages for both bidders

        // Check refund messages
        let expected_refunds = vec![
            SubMsg::new(CosmosMsg::Bank(BankMsg::Send {
                to_address: "bidder1".to_string(),
                amount: coins(200000u128, MOCK_PAYMENT_DENOM),
            })),
            SubMsg::new(CosmosMsg::Bank(BankMsg::Send {
                to_address: "bidder2".to_string(),
                amount: coins(150000u128, MOCK_PAYMENT_DENOM),
            })),
        ];

        for expected_msg in expected_refunds {
            assert!(res.messages.contains(&expected_msg));
        }

        // Verify attributes
        assert!(res
            .attributes
            .iter()
            .any(|attr| attr.key == "method" && attr.value == "conclude_deal_refund"));
        assert!(res
            .attributes
            .iter()
            .any(|attr| attr.key == "reason" && attr.value == "min_cap_not_met"));
        assert!(res
            .attributes
            .iter()
            .any(|attr| attr.key == "total_refunded" && attr.value == "350000"));

        // Verify deal is marked as concluded
        let deal = DEALS.load(deps.as_ref().storage, 1).unwrap();
        assert!(deal.is_concluded);

        // Try to conclude again - should fail
        let conclude_msg = ExecuteMsg::ConcludeDeal { deal_id: 1 };
        let info = mock_info("anyone", &[]);
        let err = execute(
            deps.as_mut(),
            mock_env_at_time(conclude_time),
            info,
            conclude_msg,
        )
        .unwrap_err();
        assert!(matches!(err, ContractError::DealAlreadyConcluded {}));

        // Verify bids were not removed (optional, depending on your contract's behavior)
        assert!(BIDS
            .may_load(deps.as_ref().storage, (1, &Addr::unchecked("bidder1")))
            .unwrap()
            .is_some());
        assert!(BIDS
            .may_load(deps.as_ref().storage, (1, &Addr::unchecked("bidder2")))
            .unwrap()
            .is_some());
    }

    #[test]
    fn test_validation_errors() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let current_time = 1000u64;
        let env = mock_env_at_time(current_time);

        let msg = ExecuteMsg::CreateDeal {
            sell_token: MOCK_SELL_TOKEN.to_string(),
            bid_token_denom: "uusdc".to_string(),
            total_amount: Uint128::new(1000000u128),
            min_price: Uint128::new(1u128),
            discount_percentage: 11000, // Invalid: > 100%
            min_cap: Uint128::new(500000u128),
            bid_start_time: current_time + 1000,
            bid_end_time: current_time + 2000,
            conclude_time: current_time + 3000,
        };

        let info = mock_info("seller", &coins(10000, MOCK_PAYMENT_DENOM));
        let err = execute(deps.as_mut(), env.clone(), info, msg).unwrap_err();
        match err {
            ContractError::InvalidTimeParameters { reason } => {
                assert!(reason.contains("Discount percentage"));
            }
            _ => panic!("Expected InvalidTimeParameters error for invalid discount percentage"),
        }
    }
}
