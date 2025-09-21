package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/ekelhala/kauppalista/internal/auth"
	"github.com/ekelhala/kauppalista/internal/service"
)

type ListHandler struct {
	svc *service.ListService
}

func NewListHandler(svc *service.ListService) *ListHandler {
	return &ListHandler{svc: svc}
}

func (h *ListHandler) HandleGetLists(w http.ResponseWriter, r *http.Request) {
	ownerID := auth.UserIDFromContext(r.Context())
	lists, err := h.svc.GetAllLists(ownerID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to retrieve lists"})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(lists)
}

func (h *ListHandler) HandleGetListItems(w http.ResponseWriter, r *http.Request) {
	var listID = chi.URLParam(r, "listID")
	if listID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "List ID is required"})
		return
	}
	authenticatedUserID := auth.UserIDFromContext(r.Context())
	list, err := h.svc.GetListItems(listID, authenticatedUserID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to retrieve list"})
		return
	}
	if list == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "List not found"})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(&GetListItemsResponse{Items: list})
}

func (h *ListHandler) HandleCreateList(w http.ResponseWriter, r *http.Request) {
	var req CreateListRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Invalid request payload"})
		return
	}
	if req.Name == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "List name is required"})
		return
	}
	// try to get authenticated user id from context (middleware may set it)
	ownerID := auth.UserIDFromContext(r.Context())

	id, err := h.svc.CreateList(req.Name, ownerID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to create list"})
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"id": id})
}

func (h *ListHandler) HandleAddItem(w http.ResponseWriter, r *http.Request) {
	var req AddItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Invalid request payload"})
		return
	}
	var listID = chi.URLParam(r, "listID")
	if listID == "" || req.Name == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "List ID and item name are required"})
		return
	}
	authenticatedUserID := auth.UserIDFromContext(r.Context())
	id, err := h.svc.AddItem(listID, req.Name, authenticatedUserID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to add item"})
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"id": id})
}

func (h *ListHandler) HandleDeleteList(w http.ResponseWriter, r *http.Request) {
	var listID = chi.URLParam(r, "listID")
	if listID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "List ID is required"})
		return
	}
	authenticatedUserID := auth.UserIDFromContext(r.Context())
	if err := h.svc.DeleteList(listID, authenticatedUserID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to delete list"})
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte{})
}

func (h *ListHandler) HandleShareList(w http.ResponseWriter, r *http.Request) {
	var req ShareListRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Invalid request payload"})
		return
	}
	var listID = chi.URLParam(r, "listID")
	if listID == "" || req.ToUser == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "List ID and user ID are required"})
		return
	}
	authenticatedUserID := auth.UserIDFromContext(r.Context())
	if err := h.svc.ShareList(listID, req.ToUser, authenticatedUserID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to share list"})
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte{})
}

func (h *ListHandler) HandleGetSharedWithMe(w http.ResponseWriter, r *http.Request) {
	ownerID := auth.UserIDFromContext(r.Context())
	lists, err := h.svc.GetSharedWithMe(ownerID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Message: "Failed to retrieve lists"})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(lists)
}
