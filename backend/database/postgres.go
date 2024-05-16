package database

import (
	"database/sql"
)

func GetDB() (*sql.DB, error) {
	// Construct connection string
	connStr := "user=postgres password=Bud29K7{9 dbname=postgres sslmode=disable"

	// Connect to the database
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	// Check if the connection is successful
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return db, nil
}
