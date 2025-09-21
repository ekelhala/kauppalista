package repository

type Item struct {
	ID       string `json:"id" gorm:"primaryKey"`
	ListID   string `json:"-" gorm:"index"`
	Name     string `json:"name"`
	Checked  bool   `json:"checked"`
	Quantity int    `json:"quantity"`
}

type List struct {
	ID    string `json:"id" gorm:"primaryKey"`
	Name  string `json:"name"`
	Owner string `json:"-" gorm:"index"`
	Items []Item `json:"-" gorm:"foreignKey:ListID;constraint:OnDelete:CASCADE"`
}

type AccessMapping struct {
	ID     string `json:"id" gorm:"primaryKey"`
	ListID string `json:"list_id" gorm:"index;uniqueIndex:idx_list_id"`
	UserID string `json:"user_id" gorm:"index;uniqueIndex:idx_list_owner"`
}
