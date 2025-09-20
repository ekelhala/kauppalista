package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ekelhala/kauppalista/internal/service"
	"github.com/go-chi/chi/v5"
)

type ItemHandler struct {
	svc *service.ItemService
}

func NewItemHandler(svc *service.ItemService) *ItemHandler {
	return &ItemHandler{svc: svc}
}

func (h *ItemHandler) HandleToggleItem(w http.ResponseWriter, r *http.Request) {
	itemID := chi.URLParam(r, "itemID")
	if itemID == "" {
		http.Error(w, "itemID is required", http.StatusBadRequest)
		return
	}

	if err := h.svc.ToggleItem(itemID); err != nil {
		http.Error(w, "Failed to toggle item", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte{})
}

func (h *ItemHandler) HandleDeleteItem(w http.ResponseWriter, r *http.Request) {
	itemID := chi.URLParam(r, "itemID")
	if itemID == "" {
		http.Error(w, "itemID is required", http.StatusBadRequest)
		return
	}

	if err := h.svc.DeleteItem(itemID); err != nil {
		http.Error(w, "Failed to delete item", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte{})
}

func (h *ItemHandler) HandleUpdateItemName(w http.ResponseWriter, r *http.Request) {
	itemID := chi.URLParam(r, "itemID")
	if itemID == "" {
		http.Error(w, "itemID is required", http.StatusBadRequest)
		return
	}

	var req struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if req.Name == "" {
		http.Error(w, "Item name is required", http.StatusBadRequest)
		return
	}

	if err := h.svc.UpdateItemName(itemID, req.Name); err != nil {
		http.Error(w, "Failed to update item name", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte{})
}
