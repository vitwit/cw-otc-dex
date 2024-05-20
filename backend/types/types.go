package types

type Deal struct {
	BidToken        string  `json:"bid_token"`
	DealCreator     string  `json:"deal_creator"`
	DealTokenAmount string  `json:"deal_token_amount"`
	DealTokenDenom  string  `json:"deal_token_denom"`
	EndBlock        string  `json:"end_block"`
	MinCap          string  `json:"min_cap"`
	MinPrice        string  `json:"min_price"`
	StartBlock      string  `json:"start_block"`
	TotalBid        string  `json:"total_bid"`
	Status          string  `json:"status"`
	ID              float64 `json:"id"`
	Description     string  `json:"description"`
	Title           string  `json:"title"`
	
}

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

