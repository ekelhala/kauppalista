package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"
)

type IdentityUser struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

type IdentityService struct {
	Issuer             string
	ManagementAudience string
	ClientID           string
	ClientSecret       string
	Client             *http.Client
}

func NewIdentityService(issuer, managementAudience, clientID, clientSecret string) *IdentityService {
	return &IdentityService{
		Issuer:             strings.TrimSuffix(issuer, "/"),
		ManagementAudience: managementAudience,
		ClientID:           clientID,
		ClientSecret:       clientSecret,
		Client:             &http.Client{Timeout: 10 * time.Second},
	}
}

func getToken(clientID, clientSecret, audience, issuer string) (string, error) {
	payload, err := json.Marshal(map[string]string{
		"grant_type":    "client_credentials",
		"client_id":     clientID,
		"client_secret": clientSecret,
		"audience":      audience,
	})
	if err != nil {
		return "", err
	}
	tokenURL := fmt.Sprintf("%s/oauth/token", strings.TrimSuffix(issuer, "/"))
	req, err := http.NewRequest(http.MethodPost, tokenURL, bytes.NewBuffer(payload))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
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

// SearchUsers searches users using Auth0 Management API.
func (k *IdentityService) SearchUsers(ctx context.Context, q string) ([]IdentityUser, error) {
	u := fmt.Sprintf("%s/api/v2/users", k.Issuer)
	req, err := http.NewRequestWithContext(ctx, "GET", u, nil)
	if err != nil {
		log.Println("failed to create request:", err)
		return nil, err
	}
	// Keep result size bounded for share dialog lookups.
	qp := req.URL.Query()
	if q != "" {
		escaped := strings.ReplaceAll(q, "\"", "\\\"")
		qp.Set("q", fmt.Sprintf("username:*%s* OR nickname:*%s* OR email:*%s*", escaped, escaped, escaped))
	}
	qp.Set("search_engine", "v3")
	qp.Set("per_page", "20")
	req.URL.RawQuery = qp.Encode()

	accessToken, err := getToken(k.ClientID, k.ClientSecret, k.ManagementAudience, k.Issuer)
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
		return nil, fmt.Errorf("auth0 user search returned status %d", resp.StatusCode)
	}

	var auth0Users []struct {
		ID       string `json:"user_id"`
		Username string `json:"username"`
		Nickname string `json:"nickname"`
		Name     string `json:"name"`
		Email    string `json:"email"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&auth0Users); err != nil {
		return nil, err
	}

	users := make([]IdentityUser, 0, len(auth0Users))
	for _, u := range auth0Users {
		display := u.Username
		if display == "" {
			display = u.Nickname
		}
		if display == "" {
			display = u.Name
		}
		if display == "" {
			display = u.Email
		}
		users = append(users, IdentityUser{ID: u.ID, Username: display})
	}

	return users, nil
}
