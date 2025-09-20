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

func (s *ListService) GetListItems(listID string) ([]repository.Item, error) {
	// Business logic to retrieve a specific list by ID
	return s.listRepo.GetByID(listID)
}

func (s *ListService) CreateList(name string) (string, error) {
	// Business logic to create a new list
	return s.listRepo.CreateList(name)
}

func (s *ListService) AddItem(listID, itemName string) (string, error) {
	// Business logic to add an item to a list
	return s.listRepo.AddItem(listID, itemName)
}

func (s *ListService) DeleteList(listID string) error {
	// Business logic to delete a list
	return s.listRepo.DeleteList(listID)
}
