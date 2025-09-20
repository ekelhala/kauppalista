package repository

import (
	"github.com/google/uuid"
	gorm "gorm.io/gorm"
)

type ListRepository struct {
	db *gorm.DB
}

func NewListRepository(db *gorm.DB) *ListRepository {
	db.AutoMigrate(&List{}, &Item{})
	return &ListRepository{db: db}
}

func NewInMemoryListRepository() *ListRepository {
	return &ListRepository{db: nil}
}

func (r *ListRepository) GetAll() ([]List, error) {
	var lists []List
	result := r.db.Preload("Items").Find(&lists)
	return lists, result.Error
}

func (r *ListRepository) CreateList(name string) (string, error) {
	list := List{Name: name, Items: []Item{}, ID: uuid.New().String()}
	result := r.db.Create(&list)
	return list.ID, result.Error
}
