package api

import (
	"net/http"

	"github.com/ekelhala/kauppalista/internal/handlers"
	"github.com/ekelhala/kauppalista/internal/service"
	"github.com/go-chi/chi/v5"
)

func usersRouter(identitySvc *service.IdentityService) http.Handler {
	r := chi.NewRouter()
	// GET /users?q=searchtext
	r.Get("/", handlers.SearchUsersHandler(identitySvc))
	return r
}
