package api

import (
	"encoding/json"
	"net/http"

	"github.com/ekelhala/kauppalista/internal/service"
)

type Handler struct {
	listService *service.ListService
}

func NewHandler(listService *service.ListService) *Handler {
	return &Handler{listService: listService}
}

func (h *Handler) HandleGetLists(w http.ResponseWriter, r *http.Request) {
	lists, err := h.listService.GetAllLists()
	if err != nil {
		http.Error(w, "Failed to retrieve lists", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(lists)
}

func (h *Handler) HandleCreateList(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if req.Name == "" {
		http.Error(w, "List name is required", http.StatusBadRequest)
		return
	}
	id, err := h.listService.CreateList(req.Name)
	if err != nil {
		http.Error(w, "Failed to create list", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"id": id})
}
