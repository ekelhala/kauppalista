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
	return s.itemRepo.ToggleItem(itemID)
}

func (s *ItemService) DeleteItem(itemID string) error {
	return s.itemRepo.DeleteItem(itemID)
}

func (s *ItemService) UpdateItemName(itemID, newName string) error {
	return s.itemRepo.UpdateItemName(itemID, newName)
}

func (s *ItemService) IncreaseItemQuantity(itemID string) error {
	return s.itemRepo.IncreaseItemQuantity(itemID)
}

func (s *ItemService) DecreaseItemQuantity(itemID string) error {
	return s.itemRepo.DecreaseItemQuantity(itemID)
}
