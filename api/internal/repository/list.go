package repository

import (
	gorm "gorm.io/gorm"
)

type ListRepository struct {
	db       *gorm.DB
	repoType string
}

func NewListRepository() *ListRepository {
	db, err := gorm.Open(gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	return &ListRepository{db: db, repoType: "sql"}
}

func NewInMemoryListRepository() *ListRepository {
	return &ListRepository{db: nil, repoType: "memory"}
}

func (r *ListRepository) GetAll() ([]List, error) {
	// Data access logic to retrieve all lists
	if r.repoType == "sql" {
		// SQL-specific logic
		return []List{
			{ID: "1", Name: "SQL List 1", Items: []Item{{ID: "1", Name: "Item 1", Checked: false}}},
			{ID: "2", Name: "SQL List 2", Items: []Item{{ID: "2", Name: "Item 2", Checked: true}}},
		}, nil
	}
	// In-memory logic
	return []List{
		{ID: "1", Name: "Memory List 1", Items: []Item{{ID: "1", Name: "Item 1", Checked: false}}},
		{ID: "2", Name: "Memory List 2", Items: []Item{{ID: "2", Name: "Item 2", Checked: true}}},
	}, nil
}
