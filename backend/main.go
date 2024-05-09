package main

import (
	"fmt"
	"github.com/rs/zerolog"
	"github.com/vitwit/dots/backend/database"
	"github.com/vitwit/dots/backend/endpoints"
	"sync"

	_ "github.com/lib/pq"
)

func main() {
	db, err := database.GetDB()
	if err != nil {
		fmt.Println("Error opening database connection:", err)
		return
	}

	if err != nil {
		fmt.Println("Error connecting to the database:", err)
		return
	}
	fmt.Println("Connected to the database!")

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	// Initialize the router
	endpoints.GetEndpoints(db)

	var wg sync.WaitGroup
	wg.Add(1)
	wg.Wait()
}
