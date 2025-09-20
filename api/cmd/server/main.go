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
	"github.com/ekelhala/kauppalista/internal/config"
	"github.com/ekelhala/kauppalista/internal/repository"
	"github.com/ekelhala/kauppalista/internal/service"
)

func main() {
	err := godotenv.Load()

	configPath := "config.yaml"
	config := config.LoadConfig(configPath)
	if config == nil {
		log.Panic("Failed to load configuration!")
	}

	log.Println("Configuration loaded successfully.")
	routerConfig := &api.RouterConfig{
		CorsAllowedOrigins:   config.Cors.AllowOrigins,
		CorsAllowCredentials: config.Cors.AllowCredentials,
	}

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
	router := api.NewRouter(listService, itemService, routerConfig)
	log.Printf("starting server on %s:%d", config.Server.Host, config.Server.Port)
	http.ListenAndServe(fmt.Sprintf("%s:%d", config.Server.Host, config.Server.Port), router.Mux)
}
