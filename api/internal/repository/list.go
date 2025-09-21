package repository

import (
	"github.com/google/uuid"
	gorm "gorm.io/gorm"
)

type ListRepository struct {
	db *gorm.DB
}

func NewListRepository(db *gorm.DB) *ListRepository {
	db.AutoMigrate(&List{})
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
	return r.db.Delete(&List{}, "id = ?", listID).Error
}
