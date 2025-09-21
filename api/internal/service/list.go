package service

import (
	"errors"

	"github.com/ekelhala/kauppalista/internal/repository"
)

type ListService struct {
	listRepo repository.ListRepository
}

func NewListService(repo *repository.ListRepository) *ListService {
	return &ListService{listRepo: *repo}
}

func (s *ListService) GetAllLists(ownerID string) ([]repository.List, error) {
	// Business logic to retrieve all lists
	return s.listRepo.GetAll(ownerID)
}

func (s *ListService) GetListItems(listID string, userID string) ([]repository.Item, error) {
	// Business logic to retrieve a specific list by ID
	isOwner, err := s.listRepo.IsListOwner(listID, userID)
	if err != nil {
		return nil, err
	}
	if !isOwner {
		return nil, errors.New("user is not the owner of the list")
	}
	return s.listRepo.GetByID(listID)
}

func (s *ListService) CreateList(name, ownerID string) (string, error) {
	// Business logic to create a new list with owner
	return s.listRepo.CreateList(name, ownerID)
}

func (s *ListService) AddItem(listID, itemName string, userID string) (string, error) {
	// Business logic to add an item to a list
	isOwner, err := s.listRepo.IsListOwner(listID, userID)
	if err != nil {
		return "", err
	}
	if !isOwner {
		return "", errors.New("user is not the owner of the list")
	}
	return s.listRepo.AddItem(listID, itemName)
}

func (s *ListService) DeleteList(listID string, userID string) error {
	// Business logic to delete a list
	isOwner, err := s.listRepo.IsListOwner(listID, userID)
	if err != nil {
		return err
	}
	if !isOwner {
		return errors.New("user is not the owner of the list")
	}
	return s.listRepo.DeleteList(listID)
}

func (s *ListService) ShareList(listID, toUser string, userID string) error {
	// Business logic to share a list with another user
	isOwner, err := s.listRepo.IsListOwner(listID, userID)
	if err != nil {
		return err
	}
	if isOwner {
		return s.listRepo.ShareList(listID, toUser)
	}
	return errors.New("user is not the owner of the list")
}

func (s *ListService) GetSharedWithMe(userID string) ([]repository.List, error) {
	// Business logic to get lists shared with the user
	return s.listRepo.GetSharedWithMe(userID)
}
