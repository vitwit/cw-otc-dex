package handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

func GetCompletedDeals(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := r.URL.Query()
		wallet := params.Get("wallet")
		w.Header().Set("Content-Type", "application/json")
		err := json.NewEncoder(w).Encode(wallet)
		if err != nil {
			http.Error(w, fmt.Errorf("error while encoding rewards: %w", err).Error(), http.StatusInternalServerError)
			return
		}
	}
}
