package service

import (
	"github.com/ekelhala/kauppalista/internal/repository"
)

type ListService struct {
	listRepo repository.ListRepository
}

func NewListService(repo *repository.ListRepository) *ListService {
	return &ListService{listRepo: *repo}
}

func (s *ListService) GetAllLists() ([]repository.List, error) {
	// Business logic to retrieve all lists
	return s.listRepo.GetAll()
}
