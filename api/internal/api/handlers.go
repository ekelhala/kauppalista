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
