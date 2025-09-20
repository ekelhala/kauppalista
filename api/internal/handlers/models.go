package handlers

import "github.com/ekelhala/kauppalista/internal/repository"

type CreateListRequest struct {
	Name string `json:"name"`
}

type AddItemRequest struct {
	Name string `json:"name"`
}

type UpdateItemNameRequest struct {
	Name string `json:"name"`
}

type ErrorResponse struct {
	Message string `json:"message"`
}

type GetListItemsResponse struct {
	Items []repository.Item `json:"items"`
}
