package api

import (
	"net/http"

	"github.com/ekelhala/kauppalista/internal/handlers"
	"github.com/ekelhala/kauppalista/internal/service"
	"github.com/go-chi/chi/v5"
)

func usersRouter(kcSvc *service.KeycloakService) http.Handler {
	r := chi.NewRouter()
	// GET /users?q=searchtext
	r.Get("/", handlers.SearchUsersHandler(kcSvc))
	return r
}
