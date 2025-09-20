package repository

import (
	gorm "gorm.io/gorm"
)

type ItemRepository struct {
	db *gorm.DB
}

func NewItemRepository(db *gorm.DB) *ItemRepository {
	db.AutoMigrate(&Item{})
	return &ItemRepository{db: db}
}

func (r *ItemRepository) ToggleItem(itemID string) error {
	var item Item
	if err := r.db.First(&item, "id = ?", itemID).Error; err != nil {
		return err
	}
	item.Checked = !item.Checked
	return r.db.Save(&item).Error
}

func (r *ItemRepository) DeleteItem(itemID string) error {
	return r.db.Delete(&Item{}, "id = ?", itemID).Error
}

func (r *ItemRepository) UpdateItemName(itemID, newName string) error {
	return r.db.Model(&Item{}).Where("id = ?", itemID).Update("name", newName).Error
}

func (r *ItemRepository) IncreaseItemQuantity(itemID string) error {
	return r.db.Model(&Item{}).Where("id = ?", itemID).Update("quantity", gorm.Expr("quantity + ?", 1)).Error
}
func (r *ItemRepository) DecreaseItemQuantity(itemID string) error {
	return r.db.Model(&Item{}).Where("id = ? AND quantity > 1", itemID).Update("quantity", gorm.Expr("quantity - ?", 1)).Error
}
