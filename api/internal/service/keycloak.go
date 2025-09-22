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
	ID       string `json:"id"`
	Username string `json:"username"`
}

type KeycloakService struct {
	BaseURL    string // e.g. https://keycloak.example.com
	Realm      string
	AdminToken string // simplest approach: inject a token with rights; replace with client credentials retrieval
	ClientId   string
	Client     *http.Client
}

func NewKeycloakService(baseURL, realm, adminToken, clientId string) *KeycloakService {
	return &KeycloakService{
		BaseURL:    baseURL,
		Realm:      realm,
		AdminToken: adminToken,
		ClientId:   clientId,
		Client:     &http.Client{Timeout: 10 * time.Second},
	}
}

func getToken(clientID string, clientSecret string, realm string, baseUrl string) (string, error) {

	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)

	resp, err := http.PostForm(fmt.Sprintf("%s/realms/%s/protocol/openid-connect/token", baseUrl, realm), data)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to get token: %s", resp.Status)
	}

	var result struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}
	return result.AccessToken, nil
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

	accessToken, err := getToken(k.ClientId, k.AdminToken, k.Realm, k.BaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to get access token: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
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
