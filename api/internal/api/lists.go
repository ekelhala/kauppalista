package api

import (
	"net/http"

	"github.com/ekelhala/kauppalista/internal/service"
	"github.com/go-chi/chi/v5"
)

func listsRouter(svc *service.ListService) http.Handler {
	r := chi.NewRouter()
	handler := NewHandler(svc)

	r.Get("/", handler.HandleGetLists)
	r.Post("/", handler.HandleCreateList)

	return r
}
