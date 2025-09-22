package api

import (
	"net/http"

	"github.com/ekelhala/kauppalista/internal/handlers"
	"github.com/ekelhala/kauppalista/internal/service"
	"github.com/go-chi/chi/v5"
)

func listsRouter(svc *service.ListService) http.Handler {
	r := chi.NewRouter()
	handler := handlers.NewListHandler(svc)

	r.Get("/", handler.HandleGetLists)
	r.Get("/{listID}", handler.HandleGetListItems)
	r.Post("/", handler.HandleCreateList)
	r.Post("/{listID}", handler.HandleAddItem)
	r.Delete("/{listID}", handler.HandleDeleteList)
	r.Get("/shared", handler.HandleGetSharedWithMe)
	r.Post("/{listID}/share", handler.HandleShareList)
	r.Post("/{listID}/pin", handler.HandlePinList)
	r.Post("/{listID}/unpin", handler.HandleUnpinList)
	r.Get("/pinned", handler.HandleGetPinnedLists)

	return r
}
