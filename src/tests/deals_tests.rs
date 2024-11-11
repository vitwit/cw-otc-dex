use crate::contract::{execute, instantiate};
use crate::error::ContractError;
use crate::msg::{DealsResponse, ExecuteMsg, InstantiateMsg, QueryMsg};
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{coins, from_binary, DepsMut, Env, Timestamp, Uint128};

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
    fn test_create_deal_with_invalid_times() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let current_time = 1000u64;
        let env = mock_env_at_time(current_time);

        // Attempt to create a deal with bid_end_time before bid_start_time
        let msg = ExecuteMsg::CreateDeal {
            sell_token: MOCK_SELL_TOKEN.to_string(),
            bid_token_denom: "uusdc".to_string(),
            total_amount: Uint128::new(1000000u128),
            min_price: Uint128::new(1u128),
            discount_percentage: 1000, // 10%
            min_cap: Uint128::new(500000u128),
            bid_start_time: current_time + 2000,
            bid_end_time: current_time + 1000,
            conclude_time: current_time + 3000,
        };

        let info = mock_info("seller", &coins(10000, MOCK_PAYMENT_DENOM));
        let err = execute(deps.as_mut(), env.clone(), info, msg).unwrap_err();
        assert!(matches!(err, ContractError::InvalidTimeParameters { .. }));

        // Attempt to create a deal with conclude_time before bid_end_time
        let msg = ExecuteMsg::CreateDeal {
            sell_token: MOCK_SELL_TOKEN.to_string(),
            bid_token_denom: "uusdc".to_string(),
            total_amount: Uint128::new(1000000u128),
            min_price: Uint128::new(1u128),
            discount_percentage: 1000, // 10%
            min_cap: Uint128::new(500000u128),
            bid_start_time: current_time + 1000,
            bid_end_time: current_time + 2000,
            conclude_time: current_time + 1500, // Invalid
        };

        let info = mock_info("seller", &coins(10000, MOCK_PAYMENT_DENOM));
        let err = execute(deps.as_mut(), env.clone(), info, msg).unwrap_err();
        assert!(matches!(err, ContractError::InvalidTimeParameters { .. }));
    }

    #[test]
    fn test_create_deal_with_invalid_platform_fee() {
        let mut deps = mock_dependencies();

        // Set platform fee percentage over 100%
        let msg = InstantiateMsg {
            platform_fee_percentage: 11000, // Invalid: > 100%
        };
        let info = mock_info("creator", &[]);
        let err = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap_err();
        assert!(matches!(err, ContractError::InvalidTimeParameters { .. }));
    }

    #[test]
    fn test_list_deals() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let current_time = 1000u64;
        let env = mock_env_at_time(current_time);

        // Create multiple deals
        for i in 0..5 {
            let msg = ExecuteMsg::CreateDeal {
                sell_token: MOCK_SELL_TOKEN.to_string(),
                bid_token_denom: "uusdc".to_string(),
                total_amount: Uint128::new(1000000u128 + i),
                min_price: Uint128::new(1u128),
                discount_percentage: 1000, // 10%
                min_cap: Uint128::new(500000u128),
                bid_start_time: current_time + 1000,
                bid_end_time: current_time + 2000,
                conclude_time: current_time + 3000,
            };

            let info = mock_info("seller", &coins(10000 + i as u128, MOCK_PAYMENT_DENOM));
            execute(deps.as_mut(), env.clone(), info, msg).unwrap();
        }

        // Query the list of deals
        let res = crate::contract::query(
            deps.as_ref(),
            env.clone(),
            QueryMsg::ListDeals {
                start_after: None,
                limit: None,
            },
        )
        .unwrap();

        let deals_response: DealsResponse = from_binary(&res).unwrap();
        assert_eq!(deals_response.deals.len(), 5);
    }

    #[test]
    fn test_list_active_deals() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let current_time = 1000u64;
        let env = mock_env_at_time(current_time);

        // Create multiple deals with varying times
        for i in 0..5 {
            let bid_start = current_time + (i as u64 * 500u64);
            let bid_end = bid_start + 1000u64; // Ensure bid_end_time is after bid_start_time

            let msg = ExecuteMsg::CreateDeal {
                sell_token: MOCK_SELL_TOKEN.to_string(),
                bid_token_denom: "uusdc".to_string(),
                total_amount: Uint128::new(1000000u128 + i),
                min_price: Uint128::new(1u128),
                discount_percentage: 1000, // 10%
                min_cap: Uint128::new(500000u128),
                bid_start_time: bid_start,
                bid_end_time: bid_end,
                conclude_time: bid_end + 3000u64,
            };

            let info = mock_info("seller", &coins(10000 + i as u128, MOCK_PAYMENT_DENOM));
            execute(deps.as_mut(), env.clone(), info, msg).unwrap();
        }

        // Query the list of active deals
        let active_env = mock_env_at_time(current_time + 1500);
        let res = crate::contract::query(
            deps.as_ref(),
            active_env.clone(),
            QueryMsg::ListActiveDeals {
                start_after: None,
                limit: None,
            },
        )
        .unwrap();

        let deals_response: DealsResponse = from_binary(&res).unwrap();
        assert!(deals_response.deals.len() > 0);
    }

    #[test]
    fn test_conclude_deal_before_conclusion_time() {
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

        // Attempt to conclude the deal before conclusion time
        let conclude_msg = ExecuteMsg::ConcludeDeal { deal_id: 1 };
        let info = mock_info("anyone", &[]);
        let err = execute(
            deps.as_mut(),
            mock_env_at_time(start_time + 2500),
            info,
            conclude_msg,
        )
        .unwrap_err();

        assert!(matches!(err, ContractError::ConclusionTimeNotReached {}));
    }

    #[test]
    fn test_conclude_deal_twice() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        let start_time = 1000u64;
        let env = mock_env_at_time(start_time);

        // Create a deal
        let total_amount = Uint128::new(1_000_000u128);
        let platform_fee = total_amount.multiply_ratio(PLATFORM_FEE_PERCENTAGE as u128, 10_000u128);
        let create_msg = create_test_deal_msg(start_time);

        let info_seller = mock_info("seller", &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), env.clone(), info_seller, create_msg).unwrap();

        // Place a bid
        let bid_env = mock_env_at_time(start_time + 1500);
        let bid_amount = Uint128::new(600_000u128);
        let bid_msg = ExecuteMsg::PlaceBid {
            deal_id: 1,
            amount: bid_amount,
            discount_percentage: 500,
            max_price: None,
        };
        let info_bidder = mock_info("bidder1", &coins(bid_amount.u128(), MOCK_PAYMENT_DENOM));
        execute(deps.as_mut(), bid_env.clone(), info_bidder, bid_msg).unwrap();

        // Conclude the deal the first time
        let conclude_env = mock_env_at_time(start_time + 3500);
        let conclude_msg = ExecuteMsg::ConcludeDeal { deal_id: 1 };
        let info = mock_info("anyone", &[]);

        // Clone `info` before passing it
        execute(
            deps.as_mut(),
            conclude_env.clone(),
            info.clone(),
            conclude_msg.clone(),
        )
        .unwrap();

        // Attempt to conclude the same deal again
        let err = execute(deps.as_mut(), conclude_env.clone(), info, conclude_msg).unwrap_err();

        assert!(matches!(err, ContractError::DealAlreadyConcluded {}));
    }

    #[test]
    fn test_query_nonexistent_deal() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        // Query a deal that doesn't exist
        let res = crate::contract::query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::GetDeal { deal_id: 999 },
        );
        assert!(res.is_err());
    }
}
