package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/ekelhala/kauppalista/internal/api"
	"github.com/ekelhala/kauppalista/internal/api/middleware"
	"github.com/ekelhala/kauppalista/internal/config"
	"github.com/ekelhala/kauppalista/internal/repository"
	"github.com/ekelhala/kauppalista/internal/service"
)

var configFlag = flag.String("config", "config.yaml", "Path to configuration file")

func main() {
	flag.Parse()

	configPath := *configFlag
	config := config.LoadConfig(configPath)
	if config == nil {
		log.Panic("Failed to load configuration!")
	}

	log.Println("Configuration loaded successfully.")
	routerConfig := &api.RouterConfig{
		CorsAllowedOrigins:   config.Cors.AllowOrigins,
		CorsAllowCredentials: config.Cors.AllowCredentials,
	}

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
	kcService := service.NewKeycloakService(config.Keycloak.Issuer,
		config.Keycloak.Realm, os.Getenv("KEYCLOAK_CLIENT_SECRET"),
		config.Keycloak.ClientID)
	var authMiddleware func(http.Handler) http.Handler
	if config.Keycloak.Issuer != "" && config.Keycloak.ClientID != "" {
		authMiddleware = middleware.NewKeycloakMiddleware(config.Keycloak.Issuer, config.Keycloak.Realm, config.Keycloak.ClientID)
	} else {
		log.Panic("Keycloak configuration missing, cannot start the server!")
	}
	router := api.NewRouter(listService,
		itemService,
		kcService,
		routerConfig,
		authMiddleware)
	log.Printf("starting server on %s:%d", config.Server.Host, config.Server.Port)
	http.ListenAndServe(fmt.Sprintf("%s:%d", config.Server.Host, config.Server.Port), router.Mux)
}
