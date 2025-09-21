package service

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"time"
)

type KeycloakUser struct {
	ID        string `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type KeycloakService struct {
	BaseURL    string // e.g. https://keycloak.example.com
	Realm      string
	AdminToken string // simplest approach: inject a token with rights; replace with client credentials retrieval
	Client     *http.Client
}

func NewKeycloakService(baseURL, realm, adminToken string) *KeycloakService {
	return &KeycloakService{
		BaseURL:    baseURL,
		Realm:      realm,
		AdminToken: adminToken,
		Client:     &http.Client{Timeout: 10 * time.Second},
	}
}

// SearchUsers searches users in realm using Keycloak admin API search parameter.
// It returns a slice of users (brief representation).
func (k *KeycloakService) SearchUsers(ctx context.Context, q string) ([]KeycloakUser, error) {
	u := fmt.Sprintf("%s/admin/realms/%s/users", k.BaseURL, url.PathEscape(k.Realm))
	req, err := http.NewRequestWithContext(ctx, "GET", u, nil)
	if err != nil {
		log.Println("failed to create request:", err)
		return nil, err
	}
	// briefRepresentation=true reduces payload
	qp := req.URL.Query()
	if q != "" {
		qp.Set("search", q)
	}
	qp.Set("briefRepresentation", "true")
	req.URL.RawQuery = qp.Encode()

	req.Header.Set("Authorization", "Bearer "+k.AdminToken)
	req.Header.Set("Accept", "application/json")

	resp, err := k.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("keycloak search returned status %d", resp.StatusCode)
	}

	var users []KeycloakUser
	if err := json.NewDecoder(resp.Body).Decode(&users); err != nil {
		return nil, err
	}
	return users, nil
}
