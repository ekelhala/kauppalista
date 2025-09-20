package repository

type Item struct {
	ID      string `json:"id" gorm:"primaryKey"`
	ListID  string `json:"list_id" gorm:"index"`
	Name    string `json:"name"`
	Checked bool   `json:"checked"`
}

type List struct {
	ID    string `json:"id" gorm:"primaryKey"`
	Name  string `json:"name"`
	Items []Item `json:"items" gorm:"foreignKey:ListID;constraint:OnDelete:CASCADE"`
}
