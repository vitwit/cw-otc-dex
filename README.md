# cosmos-otc-platform 🌟

A decentralized Over-The-Counter (OTC) trading platform built with CosmWasm. This smart contract enables secure, transparent, and efficient OTC trading of tokens with customizable discount rates and bidding mechanisms.

## Features 🚀

- **Flexible Deal Creation**: Sellers can create OTC deals with:
  - Custom token selection
  - Configurable discount percentages
  - Minimum price protection
  - Minimum cap requirements
  - Customizable bidding timeframes

- **Advanced Bidding System**:
  - Buyers can place bids with desired quantities
  - Maximum price protection for buyers
  - Real-time bid updates and withdrawals
  - Automatic bid sorting by discount rates

- **Secure Deal Settlement**:
  - Automatic deal conclusion at specified time
  - Fair distribution prioritizing lowest discount bids
  - Automatic refunds for unsuccessful bids
  - Platform fee management

## Prerequisites 📋

- Rust 1.63.0+
- [wasmd](https://github.com/CosmWasm/wasmd) 0.30.0+
- [cargo-generate](https://github.com/cargo-generate/cargo-generate)

## Installation 🛠️

```bash
# Clone the repository
git clone https://github.com/yourusername/cosmos-otc-platform
cd cosmos-otc-platform

# Compile the contract
cargo build

# Run tests
cargo test

# Generate Wasm binary
cargo wasm
```

## Usage 📝

### Creating an OTC Deal

```rust
let msg = ExecuteMsg::CreateDeal {
    sell_token: "token_address",
    total_amount: Uint128::new(1000000),
    min_price: Uint128::new(100),
    discount_percentage: 10,
    min_cap: Uint128::new(500000),
    bid_start_time: 1234567890,
    bid_end_time: 1234657890,
    conclude_time: 1234747890,
};
```

### Placing a Bid

```rust
let msg = ExecuteMsg::PlaceBid {
    deal_id: 1,
    amount: Uint128::new(100000),
    discount_percentage: 5,
    max_price: Some(Uint128::new(110)),
};
```

## Contract Architecture 🏗️

```
src/
├── lib.rs          # Entry point
├── contract.rs     # Core contract logic
├── msg.rs         # Message definitions
├── state.rs       # State management
├── error.rs       # Error handling
└── helpers.rs     # Utility functions
```

## Testing 🧪

```bash
# Run all tests
cargo test

# Run specific test
cargo test test_create_deal
```

## Security Considerations 🔒

- All monetary operations are atomic
- Time-based validations prevent premature or late actions
- Minimum price protection for sellers
- Maximum price protection for buyers
- Automatic refund mechanism
- Platform fee validation

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact 📧

Anil - [@anilcse](https://twitter.com/anilcse_)

Project Link: [https://github.com/vitwit/cw-otc-dex](https://github.com/vitwit/cw-otc-dex)

## Acknowledgments 🙏

- CosmWasm team for the amazing smart contract platform

---
Made with ❤️ for the Cosmos ecosystem
