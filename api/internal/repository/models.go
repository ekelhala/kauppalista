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
	Items []Item `json:"-" gorm:"foreignKey:ListID;constraint:OnDelete:CASCADE"`
}
