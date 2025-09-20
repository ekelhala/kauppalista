package api

import (
	"net/http"

	"github.com/ekelhala/kauppalista/internal/handlers"
	"github.com/ekelhala/kauppalista/internal/service"
	"github.com/go-chi/chi/v5"
)

func itemsRouter(svc *service.ItemService) http.Handler {
	r := chi.NewRouter()
	handler := handlers.NewItemHandler(svc)

	r.Post("/{itemID}/toggle", handler.HandleToggleItem)
	r.Delete("/{itemID}", handler.HandleDeleteItem)
	r.Put("/{itemID}", handler.HandleUpdateItemName)

	return r
}
