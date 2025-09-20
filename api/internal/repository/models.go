package repository

type Item struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Checked bool   `json:"checked"`
}

type List struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Items []Item `json:"items"`
}
