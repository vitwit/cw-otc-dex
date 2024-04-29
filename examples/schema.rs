// use cosmwasm_schema::JsonSchema;
use cw_dotc::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};

// Define your messages directly
#[derive(Debug, Clone, PartialEq)]
pub enum MyInstantiateMsg {
    // Define your instantiate message variants here
}

#[derive(Debug, Clone, PartialEq)]
pub enum MyQueryMsg {
    // Define your query message variants here
}

#[derive(Debug, Clone, PartialEq)]
pub enum MyExecuteMsg {
    // Define your execute message variants here
}

fn main() {
    // No need to use write_api! macro
    // Define your messages directly above, and they will automatically implement JsonSchema
}
