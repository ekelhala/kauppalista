package main

import (
	"log"
	"net/http"

	"github.com/ekelhala/kauppalista/internal/api"
	"github.com/ekelhala/kauppalista/internal/repository"
	"github.com/ekelhala/kauppalista/internal/service"
)

func main() {
	// Entry point for the server application
	listRepo := repository.NewInMemoryListRepository()
	listService := service.NewListService(listRepo)
	router := api.NewRouter(listService)
	log.Println("Starting server on :8080")
	http.ListenAndServe(":8080", router.Mux)
}
