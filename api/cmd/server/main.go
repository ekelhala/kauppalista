package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/ekelhala/kauppalista/internal/api"
	"github.com/ekelhala/kauppalista/internal/repository"
	"github.com/ekelhala/kauppalista/internal/service"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, proceeding with environment variables")
	}
	dbConn := fmt.Sprintf("host=%s user=%s dbname=%s password=%s",
		os.Getenv("PSQL_HOST"),
		os.Getenv("PSQL_USER"),
		os.Getenv("PSQL_DB"),
		os.Getenv("PSQL_PASSWORD"),
	)
	db, err := gorm.Open(postgres.Open(dbConn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database")
	}
	// Entry point for the server application
	listRepo := repository.NewListRepository(db)
	itemRepo := repository.NewItemRepository(db)
	listService := service.NewListService(listRepo)
	itemService := service.NewItemService(itemRepo)
	router := api.NewRouter(listService, itemService)
	log.Println("Starting server on :8080")
	http.ListenAndServe(":8080", router.Mux)
}
