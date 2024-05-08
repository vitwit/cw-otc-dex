package main

import (
	"fmt"
	"github.com/rs/zerolog"
	"github.com/vitwit/dots/backend/database"
	"github.com/vitwit/dots/backend/handler"
	"net/http"
	"sync"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/zerolog/log"
)

func main() {
	db, err := database.GetDB()
	if err != nil {
		fmt.Println("Error opening database connection:", err)
		return
	}
	defer db.Close()
	err = db.Ping()
	if err != nil {
		fmt.Println("Error connecting to the database:", err)
		return
	}
	fmt.Println("Connected to the database!")

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	logger := log.Logger
	defer func() {
		if r := recover(); r != nil {
			logger.Debug().Msgf("recovered from panic:: %v", r)
		}
	}()

	// Initialize the router
	router := mux.NewRouter()

	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	// Wrap the router with the CORS middleware

	// Define REST API endpoints
	router.HandleFunc("/completed-deals", handler.GetCompletedDeals(db)).Methods("OPTIONS", "GET")

	// CORS middleware
	http.Handle("/", corsMiddleware(router))

	// Start the server
	go func() {
		logger.Info().Msg("REST server started on 8000 port")
		log.Error().Err(http.ListenAndServe(":8000", router))
	}()

	var wg sync.WaitGroup
	wg.Add(1)
	wg.Wait()
}
