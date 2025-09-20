package service

import (
	"github.com/ekelhala/kauppalista/internal/repository"
)

type ItemService struct {
	itemRepo repository.ItemRepository
}

func NewItemService(itemRepo *repository.ItemRepository) *ItemService {
	return &ItemService{itemRepo: *itemRepo}
}

func (s *ItemService) ToggleItem(itemID string) error {
	// Business logic to toggle an item's checked status
	return s.itemRepo.ToggleItem(itemID)
}

func (s *ItemService) DeleteItem(itemID string) error {
	// Business logic to delete an item
	return s.itemRepo.DeleteItem(itemID)
}

func (s *ItemService) UpdateItemName(itemID, newName string) error {
	// Business logic to update an item's name
	return s.itemRepo.UpdateItemName(itemID, newName)
}
