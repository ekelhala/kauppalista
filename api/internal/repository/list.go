package repository

import (
	"github.com/google/uuid"
	gorm "gorm.io/gorm"
)

type ListRepository struct {
	db *gorm.DB
}

func NewListRepository(db *gorm.DB) *ListRepository {
	db.AutoMigrate(&List{}, &AccessMapping{}, &PinnedList{})
	return &ListRepository{db: db}
}

func NewInMemoryListRepository() *ListRepository {
	return &ListRepository{db: nil}
}

func (r *ListRepository) GetAll(ownerID string) ([]List, error) {
	var lists []List
	result := r.db.Preload("Items").Where("owner = ?", ownerID).Find(&lists)
	return lists, result.Error
}

func (r *ListRepository) GetByID(listID string) ([]Item, error) {
	var list List
	result := r.db.Preload("Items").First(&list, "id = ?", listID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return list.Items, nil
}

func (r *ListRepository) CreateList(name, ownerID string) (string, error) {
	list := List{Name: name, Items: []Item{}, ID: uuid.New().String(), Owner: ownerID}
	r.db.Create(&AccessMapping{
		ID:     uuid.New().String(),
		ListID: list.ID,
		UserID: ownerID,
	})
	result := r.db.Create(&list)
	return list.ID, result.Error
}

func (r *ListRepository) AddItem(listID, itemName string) (string, error) {
	item := Item{Name: itemName,
		Checked:  false,
		ListID:   listID,
		ID:       uuid.New().String(),
		Quantity: 1}
	result := r.db.Create(&item)
	return item.ID, result.Error
}

func (r *ListRepository) DeleteList(listID string) error {
	r.db.Delete(&AccessMapping{}, "list_id = ?", listID)
	return r.db.Delete(&List{}, "id = ?", listID).Error
}

func (r *ListRepository) ShareList(listID, userID string) error {
	accessMapping := AccessMapping{
		ID:     uuid.New().String(),
		ListID: listID,
		UserID: userID,
	}
	return r.db.Create(&accessMapping).Error
}

func (r *ListRepository) GetSharedWithMe(userID string) ([]List, error) {
	var lists []List
	result := r.db.Joins("JOIN access_mappings ON access_mappings.list_id = lists.id").
		Where("access_mappings.user_id = ?", userID).
		Where("lists.owner != ?", userID).
		Preload("Items").
		Find(&lists)
	return lists, result.Error
}

func (r *ListRepository) IsListOwner(listID, userID string) (bool, error) {
	var list List
	result := r.db.First(&list, "id = ? AND owner = ?", listID, userID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, result.Error
	}
	return true, nil
}

func (r *ListRepository) HasAccess(listID, userID string) (bool, error) {
	var accessMapping AccessMapping
	result := r.db.First(&accessMapping, "list_id = ? AND user_id = ?", listID, userID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, result.Error
	}
	return true, nil
}

func (r *ListRepository) PinList(listID, userID string) error {
	pinnedList := PinnedList{
		ID:     uuid.New().String(),
		ListID: listID,
		UserID: userID,
	}
	return r.db.Create(&pinnedList).Error
}

func (r *ListRepository) UnpinList(listID, userID string) error {
	return r.db.Where("list_id = ? AND user_id = ?", listID, userID).Delete(&PinnedList{}).Error
}

func (r *ListRepository) GetPinnedLists(userID string) ([]List, error) {
	var lists []List
	result := r.db.Joins("JOIN pinned_lists ON pinned_lists.list_id = lists.id").
		Where("pinned_lists.user_id = ?", userID).
		Preload("Items").
		Find(&lists)
	return lists, result.Error
}

func (r *ListRepository) DeleteSelectedItems(listID string) error {
	var itemIDs []string
	result := r.db.Model(&Item{}).Where("list_id = ? AND checked = ?", listID, true).Pluck("id", &itemIDs)
	if result.Error != nil {
		return result.Error
	}
	return r.db.Where("list_id = ? AND id IN ?", listID, itemIDs).Delete(&Item{}).Error
}
