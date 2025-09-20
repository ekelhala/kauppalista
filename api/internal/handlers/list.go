package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/ekelhala/kauppalista/internal/service"
)

type ListHandler struct {
	svc *service.ListService
}

func NewListHandler(svc *service.ListService) *ListHandler {
	return &ListHandler{svc: svc}
}

func (h *ListHandler) HandleGetLists(w http.ResponseWriter, r *http.Request) {
	lists, err := h.svc.GetAllLists()
	if err != nil {
		http.Error(w, "Failed to retrieve lists", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(lists)
}

func (h *ListHandler) HandleGetListItems(w http.ResponseWriter, r *http.Request) {
	var listID = chi.URLParam(r, "listID")
	if listID == "" {
		http.Error(w, "List ID is required", http.StatusBadRequest)
		return
	}
	list, err := h.svc.GetListItems(listID)
	if err != nil {
		http.Error(w, "Failed to retrieve list", http.StatusInternalServerError)
		return
	}
	if list == nil {
		http.Error(w, "List not found", http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(list)
}

func (h *ListHandler) HandleCreateList(w http.ResponseWriter, r *http.Request) {
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
	id, err := h.svc.CreateList(req.Name)
	if err != nil {
		http.Error(w, "Failed to create list", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"id": id})
}

func (h *ListHandler) HandleAddItem(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name string `json:"name"`
	}
	var listID = chi.URLParam(r, "listID")
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if listID == "" || req.Name == "" {
		http.Error(w, "List ID and item name are required", http.StatusBadRequest)
		return
	}
	id, err := h.svc.AddItem(listID, req.Name)
	if err != nil {
		http.Error(w, "Failed to add item", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"id": id})
}

func (h *ListHandler) HandleDeleteList(w http.ResponseWriter, r *http.Request) {
	var listID = chi.URLParam(r, "listID")
	if listID == "" {
		http.Error(w, "List ID is required", http.StatusBadRequest)
		return
	}
	if err := h.svc.DeleteList(listID); err != nil {
		http.Error(w, "Failed to delete list", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte{})
}
