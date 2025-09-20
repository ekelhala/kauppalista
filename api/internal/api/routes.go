package api

import (
	"net/http"

	"github.com/ekelhala/kauppalista/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Router struct {
	Mux *chi.Mux
}

func apiRouter(listSvc *service.ListService, itemSvc *service.ItemService) http.Handler {
	r := chi.NewRouter()

	r.Mount("/lists", listsRouter(listSvc))
	r.Mount("/items", itemsRouter(itemSvc))

	return r
}

func NewRouter(listSvc *service.ListService, itemSvc *service.ItemService) *Router {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Mount("/api", apiRouter(listSvc, itemSvc))

	return &Router{Mux: r}
}
