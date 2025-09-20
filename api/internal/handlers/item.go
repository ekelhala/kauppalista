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
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "itemID is required"})
		return
	}

	if err := h.svc.ToggleItem(itemID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to toggle item"})
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte{})
}

func (h *ItemHandler) HandleDeleteItem(w http.ResponseWriter, r *http.Request) {
	itemID := chi.URLParam(r, "itemID")
	if itemID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "itemID is required"})
		return
	}

	if err := h.svc.DeleteItem(itemID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to delete item"})
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

	var req UpdateItemNameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Invalid request payload"})
		return
	}
	if req.Name == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Item name is required"})
		return
	}

	if err := h.svc.UpdateItemName(itemID, req.Name); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to update item name"})
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte{})
}

func (h *ItemHandler) HandleIncreaseItemQuantity(w http.ResponseWriter, r *http.Request) {
	itemID := chi.URLParam(r, "itemID")
	if itemID == "" {
		http.Error(w, "itemID is required", http.StatusBadRequest)
		return
	}

	if err := h.svc.IncreaseItemQuantity(itemID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to increase item quantity"})
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte{})
}

func (h *ItemHandler) HandleDecreaseItemQuantity(w http.ResponseWriter, r *http.Request) {
	itemID := chi.URLParam(r, "itemID")
	if itemID == "" {
		http.Error(w, "itemID is required", http.StatusBadRequest)
		return
	}

	if err := h.svc.DecreaseItemQuantity(itemID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to decrease item quantity"})
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte{})
}
