//! CosmWasm OTC Platform Smart Contract
//!
//! This contract implements a decentralized over-the-counter (OTC) trading platform
//! where sellers can create deals with customizable parameters and buyers can place
//! bids with their desired discount rates.
//!
//! ## Features
//!
//! * Create OTC deals with custom parameters
//! * Place, update, and withdraw bids
//! * Automatic deal conclusion
//! * Minimum price protection for sellers
//! * Maximum price protection for buyers
//! * Platform fee mechanism

pub mod contract;
pub mod error;
pub mod helpers;
pub mod msg;
pub mod state;