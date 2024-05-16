package endpoints

import (
	"database/sql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/rs/zerolog/log"
	"github.com/vitwit/dots/backend/handler"
	"net/http"
)

func GetEndpoints(db *sql.DB) {

	router := mux.NewRouter()
	// Define REST API endpoints
	router.HandleFunc("/fetch-deals", handler.GetDeals(db)).Methods("OPTIONS", "GET")
	router.HandleFunc("/create-deal", handler.CreateDeal(db)).Methods("OPTIONS", "POST")
	router.HandleFunc("/update-deal", handler.UpdateDeal(db)).Methods("OPTIONS", "POST")

	// ****** Add Bids Flow APIs WIP ******

	// CORS middleware
	// Wrap the router with the CORS middleware
	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)
        router.Use(corsMiddleware)
	http.Handle("/", corsMiddleware(router))
	logger := log.Logger
	defer func() {
		if r := recover(); r != nil {
			logger.Debug().Msgf("recovered from panic:: %v", r)
		}
	}()
	// Start the server
	go func() {
		logger.Info().Msg("REST server started on 8000 port")
		log.Error().Err(http.ListenAndServe(":8000", router))
	}()
}
