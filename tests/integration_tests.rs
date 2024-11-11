// // tests/integration_tests.rs

// use cosmwasm_std::testing::{mock_env, mock_info};
// use cosmwasm_std::{
//     coins, Addr, BankMsg, CosmosMsg, DepsMut, Empty, StdResult, SubMsg, Uint128,
// };
// use cw20::{Cw20Coin, Cw20Contract, Cw20ExecuteMsg, Cw20ReceiveMsg};
// use cw_multi_test::{App, BankKeeper, Contract, ContractWrapper, Executor};

// use cw_otc_dex::contract::{execute, instantiate, query};
// use cw_otc_dex::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
// use cw_otc_dex::state::Deal;

// const PLATFORM_FEE_PERCENTAGE: u64 = 100; // 1%
// const MOCK_PAYMENT_DENOM: &str = "uusd";

// fn contract_cw_otc_dex() -> Box<dyn Contract<Empty>> {
//     let contract = ContractWrapper::new(execute, instantiate, query);
//     Box::new(contract)
// }

// fn contract_cw20() -> Box<dyn Contract<Empty>> {
//     let contract = ContractWrapper::new(
//         cw20_base::contract::execute,
//         cw20_base::contract::instantiate,
//         cw20_base::contract::query,
//     );
//     Box::new(contract)
// }

// #[test]
// fn integration_test_with_cw20_tokens() {
//     // Set up the testing environment
//     let mut app = App::default();

//     // Upload the contracts
//     let code_id = app.store_code(contract_cw_otc_dex());
//     let cw20_code_id = app.store_code(contract_cw20());

//     // Instantiate the CW20 token contract
//     let cw20_instantiate_msg = cw20_base::msg::InstantiateMsg {
//         name: "TestToken".to_string(),
//         symbol: "TTK".to_string(),
//         decimals: 6,
//         initial_balances: vec![Cw20Coin {
//             address: "seller".to_string(),
//             amount: Uint128::new(1_000_000u128),
//         }],
//         mint: None,
//         marketing: None,
//     };

//     let token_addr = app
//         .instantiate_contract(
//             cw20_code_id,
//             Addr::unchecked("seller"),
//             &cw20_instantiate_msg,
//             &[],
//             "TestToken",
//             None,
//         )
//         .unwrap();

//     // Instantiate the OTC DEX contract
//     let msg = InstantiateMsg {
//         platform_fee_percentage: PLATFORM_FEE_PERCENTAGE,
//     };
//     let contract_addr = app
//         .instantiate_contract(code_id, Addr::unchecked("creator"), &msg, &[], "OTC DEX", None)
//         .unwrap();

//     // Seller provides the platform fee and approves token transfer
//     let platform_fee = Uint128::new(1_000_000u128 * PLATFORM_FEE_PERCENTAGE as u128 / 10_000);
//     app.init_bank_balance(
//         &Addr::unchecked("seller"),
//         coins(platform_fee.u128(), MOCK_PAYMENT_DENOM),
//     )
//     .unwrap();

//     // Seller approves the contract to transfer tokens
//     let approve_msg = Cw20ExecuteMsg::IncreaseAllowance {
//         spender: contract_addr.to_string(),
//         amount: Uint128::new(1_000_000u128),
//         expires: None,
//     };
//     app.execute_contract(
//         Addr::unchecked("seller"),
//         token_addr.clone(),
//         &approve_msg,
//         &[],
//     )
//     .unwrap();

//     // Create a deal
//     let create_deal_msg = ExecuteMsg::CreateDeal {
//         sell_token: token_addr.to_string(),
//         bid_token_denom: "uusdc".to_string(),
//         total_amount: Uint128::new(1_000_000u128),
//         min_price: Uint128::new(1u128),
//         discount_percentage: 1000, // 10%
//         min_cap: Uint128::new(500_000u128),
//         bid_start_time: app.block_info().time.plus_seconds(10).seconds(),
//         bid_end_time: app.block_info().time.plus_seconds(20).seconds(),
//         conclude_time: app.block_info().time.plus_seconds(30).seconds(),
//     };

//     // Execute the deal creation
//     let _res = app
//         .execute_contract(
//             Addr::unchecked("seller"),
//             contract_addr.clone(),
//             &create_deal_msg,
//             &coins(platform_fee.u128(), MOCK_PAYMENT_DENOM),
//         )
//         .unwrap();

//     // Fast forward to bidding period
//     app.update_block(|block| {
//         block.time = block.time.plus_seconds(15);
//     });

//     // Place bids
//     let place_bid_msg1 = ExecuteMsg::PlaceBid {
//         deal_id: 1,
//         amount: Uint128::new(300_000u128),
//         discount_percentage: 500,
//         max_price: None,
//     };

//     let place_bid_msg2 = ExecuteMsg::PlaceBid {
//         deal_id: 1,
//         amount: Uint128::new(400_000u128),
//         discount_percentage: 800,
//         max_price: None,
//     };

//     // Initialize bidders' balances
//     app.init_bank_balance(
//         &Addr::unchecked("bidder1"),
//         coins(500_000u128, MOCK_PAYMENT_DENOM),
//     )
//     .unwrap();

//     app.init_bank_balance(
//         &Addr::unchecked("bidder2"),
//         coins(500_000u128, MOCK_PAYMENT_DENOM),
//     )
//     .unwrap();

//     // Execute bid placements
//     let _res = app
//         .execute_contract(
//             Addr::unchecked("bidder1"),
//             contract_addr.clone(),
//             &place_bid_msg1,
//             &[],
//         )
//         .unwrap();

//     let _res = app
//         .execute_contract(
//             Addr::unchecked("bidder2"),
//             contract_addr.clone(),
//             &place_bid_msg2,
//             &[],
//         )
//         .unwrap();

//     // Fast forward to conclusion time
//     app.update_block(|block| {
//         block.time = block.time.plus_seconds(20);
//     });

//     // Conclude the deal
//     let conclude_deal_msg = ExecuteMsg::ConcludeDeal { deal_id: 1 };

//     let _res = app
//         .execute_contract(
//             Addr::unchecked("anyone"),
//             contract_addr.clone(),
//             &conclude_deal_msg,
//             &[],
//         )
//         .unwrap();

//     // Verify that bidders received the tokens
//     let cw20_contract = Cw20Contract(token_addr.clone());

//     let balance1 = cw20_contract
//         .balance(&app.wrap(), Addr::unchecked("bidder1"))
//         .unwrap();
//     let balance2 = cw20_contract
//         .balance(&app.wrap(), Addr::unchecked("bidder2"))
//         .unwrap();

//     assert!(balance1 > Uint128::zero());
//     assert!(balance2 > Uint128::zero());

//     // Verify seller's remaining token balance
//     let seller_balance = cw20_contract
//         .balance(&app.wrap(), Addr::unchecked("seller"))
//         .unwrap();

//     assert!(seller_balance < Uint128::new(1_000_000u128));

//     // Verify seller received payments
//     let seller_bank_balance = app
//         .wrap()
//         .query_balance("seller", MOCK_PAYMENT_DENOM)
//         .unwrap();

//     assert!(seller_bank_balance.amount > Uint128::zero());

//     // Verify deal is concluded
//     let deal: Deal = app
//         .wrap()
//         .query_wasm_smart(
//             contract_addr.clone(),
//             &QueryMsg::GetDeal { deal_id: 1 },
//         )
//         .unwrap();

//     assert!(deal.is_concluded);
// }
