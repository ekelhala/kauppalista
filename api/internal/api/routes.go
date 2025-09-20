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

func apiRouter(svc *service.ListService) http.Handler {
	r := chi.NewRouter()

	r.Mount("/lists", listsRouter(svc))

	return r
}

func NewRouter(svc *service.ListService) *Router {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Mount("/api", apiRouter(svc))

	return &Router{Mux: r}
}
