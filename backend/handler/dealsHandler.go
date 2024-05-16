package handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/vitwit/dots/backend/types"
	"net/http"
)

func GetDeals(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := r.URL.Query()
		status := params.Get("status")
		dbQuery := ""
		if status == "all" {
			dbQuery = fmt.Sprintf(`SELECT * FROM deal`)
		} else {
			dbQuery = fmt.Sprintf(`SELECT * FROM deal WHERE status = '%s'`, status)
		}
		rows, err := db.Query(dbQuery)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to fetch deals: %s", err), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var deals []types.Deal
		for rows.Next() {
			var deal types.Deal
			if err := rows.Scan(&deal.ID, &deal.BidToken, &deal.DealCreator, &deal.DealTokenAmount, &deal.DealTokenDenom, &deal.EndBlock, &deal.MinCap, &deal.MinPrice, &deal.StartBlock, &deal.TotalBid, &deal.Status); err != nil {
				http.Error(w, "Failed to scan row", http.StatusInternalServerError)
				return
			}
			deals = append(deals, deal)
		}
		w.Header().Set("Content-Type", "application/json")
		if len(deals) == 0 {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("[]"))
			return
		}

		err = json.NewEncoder(w).Encode(deals)
		if err != nil {
			http.Error(w, fmt.Errorf("error while encoding deal: %w", err).Error(), http.StatusInternalServerError)
			return
		}
	}
}

func CreateDeal(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		var deal types.Deal
		err := json.NewDecoder(r.Body).Decode(&deal)
		if err != nil {
			http.Error(w, "Failed to parse request body", http.StatusBadRequest)
			return
		}

		id := 0
		err = db.QueryRow(`
		INSERT INTO deal (BidToken, DealCreator, DealTokenAmount, DealTokenDenom, EndBlock, MinCap, MinPrice, StartBlock, TotalBid, Description, Title, Status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING ID`,
			deal.BidToken,
			deal.DealCreator,
			deal.DealTokenAmount,
			deal.DealTokenDenom,
			deal.EndBlock,
			deal.MinCap,
			deal.MinPrice,
			deal.StartBlock,
			deal.StartBlock,
			deal.Description,
			deal.Title,
			"Upcoming",
		).Scan(&id)
		if err != nil {
			fmt.Println("Error inserting row:", err)
		}

		fmt.Printf("New row ID: %d\n", id)
		w.WriteHeader(http.StatusCreated)
		w.Header().Set("Content-Type", "application/json")
		var resp types.Response
		resp.Message = "Deal has been created successfully "
		resp.Success = true
		err = json.NewEncoder(w).Encode(resp)
		if err != nil {
			http.Error(w, fmt.Errorf("error while encoding deal: %w", err).Error(), http.StatusInternalServerError)
			return
		}
	}
}

func UpdateDeal(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "PUT, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		var deal types.Deal
		err := json.NewDecoder(r.Body).Decode(&deal)
		if err != nil {
			http.Error(w, "Failed to parse request body", http.StatusBadRequest)
			return
		}

		// Construct the SQL UPDATE statement
		query := `
			UPDATE deal
			SET BidToken = COALESCE($1, BidToken),
				DealCreator = COALESCE($2, DealCreator),
				DealTokenAmount = COALESCE($3, DealTokenAmount),
				DealTokenDenom = COALESCE($4, DealTokenDenom),
				EndBlock = COALESCE($5, EndBlock),
				MinCap = COALESCE($6, MinCap),
				MinPrice = COALESCE($7, MinPrice),
				StartBlock = COALESCE($8, StartBlock),
				TotalBid = COALESCE($9, TotalBid),
				Description = COALESCE($10, Description),
				Title = COALESCE($11, Title)
			WHERE ID = $12
		`

		// Execute the SQL UPDATE statement
		_, err = db.Exec(query,
			deal.BidToken,
			deal.DealCreator,
			deal.DealTokenAmount,
			deal.DealTokenDenom,
			deal.EndBlock,
			deal.MinCap,
			deal.MinPrice,
			deal.StartBlock,
			deal.TotalBid,
			deal.Description,
			deal.Title,
			deal.ID,
		)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to update deal: %s", err), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		var resp types.Response
		resp.Message = "Deal has been updated successfully"
		resp.Success = true
		err = json.NewEncoder(w).Encode(resp)
		if err != nil {
			http.Error(w, fmt.Errorf("error while encoding response: %w", err).Error(), http.StatusInternalServerError)
			return
		}
	}
}
