package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/ekelhala/kauppalista/internal/service"
)

type UserResponse struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

func SearchUsersHandler(kc *service.KeycloakService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query().Get("q")
		users, err := kc.SearchUsers(context.Background(), q)
		if err != nil {
			log.Println("failed to search users:", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(ErrorResponse{Message: "failed to search users"})
			return
		}
		resp := make([]UserResponse, 0, len(users))
		for _, u := range users {
			resp = append(resp, UserResponse{
				ID:       u.ID,
				Username: u.Username,
			})
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}
