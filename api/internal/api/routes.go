package api

import (
	"encoding/json"
	"net/http"

	"github.com/ekelhala/kauppalista/internal/handlers"
	"github.com/ekelhala/kauppalista/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Router struct {
	Mux *chi.Mux
}

func apiRouter(listSvc *service.ListService, itemSvc *service.ItemService, identitySvc *service.IdentityService) http.Handler {
	r := chi.NewRouter()

	r.Mount("/lists", listsRouter(listSvc))
	r.Mount("/items", itemsRouter(itemSvc))
	r.Mount("/users", usersRouter(identitySvc))

	return r
}

func NewRouter(listSvc *service.ListService,
	itemSvc *service.ItemService,
	identitySvc *service.IdentityService,
	authMiddleware func(http.Handler) http.Handler) *Router {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	apiR := apiRouter(listSvc, itemSvc, identitySvc)
	apiR = authMiddleware(apiR)
	r.Mount("/api", apiR)
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(handlers.ErrorResponse{Message: "endpoint not found"})
	})

	return &Router{Mux: r}
}
