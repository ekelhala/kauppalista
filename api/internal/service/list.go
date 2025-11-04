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
	hasAccess, err := s.listRepo.HasAccess(listID, userID)
	if err != nil {
		return nil, err
	}
	if !hasAccess {
		return nil, errors.New("user does not have access to the list")
	}
	return s.listRepo.GetByID(listID)
}

func (s *ListService) CreateList(name, ownerID string) (string, error) {
	// Business logic to create a new list with owner
	return s.listRepo.CreateList(name, ownerID)
}

func (s *ListService) AddItem(listID, itemName string, userID string) (string, error) {
	// Business logic to add an item to a list
	hasAccess, err := s.listRepo.HasAccess(listID, userID)
	if err != nil {
		return "", err
	}
	if !hasAccess {
		return "", errors.New("user does not have access to the list")
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
		isShared, err := s.listRepo.HasAccess(listID, toUser)
		if err != nil {
			return err
		}
		if isShared {
			return errors.New("list is already shared with user")
		}
		return s.listRepo.ShareList(listID, toUser)
	}
	return errors.New("user is not the owner of the list")
}

func (s *ListService) GetSharedWithMe(userID string) ([]repository.List, error) {
	// Business logic to get lists shared with the user
	return s.listRepo.GetSharedWithMe(userID)
}

func (s *ListService) PinList(listID, userID string) error {
	// Business logic to pin a list for the user
	hasAccess, err := s.listRepo.HasAccess(listID, userID)
	if err != nil {
		return err
	}
	if !hasAccess {
		return errors.New("user does not have access to the list")
	}
	return s.listRepo.PinList(listID, userID)
}

func (s *ListService) UnpinList(listID, userID string) error {
	// Business logic to unpin a list for the user
	return s.listRepo.UnpinList(listID, userID)
}

func (s *ListService) GetPinnedLists(userID string) ([]repository.List, error) {
	// Business logic to get pinned lists for the user
	return s.listRepo.GetPinnedLists(userID)
}

func (s *ListService) DeleteSelectedItems(listID string, userID string) error {
	hasAccess, err := s.listRepo.HasAccess(listID, userID)
	if err != nil {
		return err
	}
	if !hasAccess {
		return errors.New("user does not have access to the list")
	}
	return s.listRepo.DeleteSelectedItems(listID)
}
