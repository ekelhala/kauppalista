package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ekelhala/kauppalista/internal/handlers"
	"github.com/ekelhala/kauppalista/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Router struct {
	Mux *chi.Mux
}

type RouterConfig struct {
	CorsAllowedOrigins   []string
	CorsAllowCredentials bool
}

func apiRouter(listSvc *service.ListService, itemSvc *service.ItemService, kcSvc *service.KeycloakService) http.Handler {
	r := chi.NewRouter()

	r.Mount("/lists", listsRouter(listSvc))
	r.Mount("/items", itemsRouter(itemSvc))
	r.Mount("/users", usersRouter(kcSvc))

	return r
}

func NewRouter(listSvc *service.ListService, itemSvc *service.ItemService, kcSvc *service.KeycloakService, config *RouterConfig, authMiddleware func(http.Handler) http.Handler) *Router {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(cors.New(cors.Options{
		AllowedOrigins:   config.CorsAllowedOrigins,
		AllowCredentials: config.CorsAllowCredentials,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	}).Handler)
	log.Printf("set CORS allowed origins: %v", config.CorsAllowedOrigins)
	apiR := apiRouter(listSvc, itemSvc, kcSvc)
	apiR = authMiddleware(apiR)
	r.Mount("/api", apiR)
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(handlers.ErrorResponse{Message: "endpoint not found"})
	})

	return &Router{Mux: r}
}
