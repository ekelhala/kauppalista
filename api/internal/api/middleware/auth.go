package middleware

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/coreos/go-oidc"
	"github.com/ekelhala/kauppalista/internal/auth"
	"github.com/ekelhala/kauppalista/internal/handlers"
)

// middleware places typed keys from internal/auth into the request context.

// NewAuthMiddleware returns a middleware that validates bearer tokens via OIDC discovery/JWKS.
func NewAuthMiddleware(issuer string, audience string) func(http.Handler) http.Handler {
	// create OIDC provider and verifier
	ctx := context.Background()
	provider, err := oidc.NewProvider(ctx, issuer)
	if err != nil {
		log.Panicf("failed to create OIDC provider from issuer %s: %v", issuer, err)
	}
	log.Printf("created OIDC provider from issuer %s", issuer)

	verifier := provider.Verifier(&oidc.Config{ClientID: audience})

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(handlers.ErrorResponse{Message: "missing authorization header"})
				return
			}
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(handlers.ErrorResponse{Message: "invalid authorization header"})
				return
			}
			tokenStr := parts[1]

			// verify signature and standard claims using OIDC verifier
			reqCtx := r.Context()
			idToken, err := verifier.Verify(reqCtx, tokenStr)
			if err != nil {
				log.Printf("token verification failed: %v", err)
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(handlers.ErrorResponse{Message: "invalid token"})
				return
			}

			// Extract stable ID and best-effort display identifier across providers.
			var tokenClaims struct {
				Sub               string `json:"sub"`
				PreferredUsername string `json:"preferred_username"`
				Nickname          string `json:"nickname"`
				Name              string `json:"name"`
				Email             string `json:"email"`
			}
			if err := idToken.Claims(&tokenClaims); err != nil {
				log.Printf("failed to parse token claims: %v", err)
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(handlers.ErrorResponse{Message: "invalid token claims"})
				return
			}

			sub := tokenClaims.Sub
			username := tokenClaims.PreferredUsername
			if username == "" {
				username = tokenClaims.Nickname
			}
			if username == "" {
				username = tokenClaims.Name
			}
			if username == "" {
				username = tokenClaims.Email
			}
			if sub == "" {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(handlers.ErrorResponse{Message: "missing subject claim"})
				return
			}

			// set typed keys
			ctx := context.WithValue(r.Context(), auth.UserIDKey, sub)
			ctx = context.WithValue(ctx, auth.UsernameKey, username)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
