package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/coreos/go-oidc"
	"github.com/ekelhala/kauppalista/internal/auth"
	"github.com/ekelhala/kauppalista/internal/handlers"
)

// middleware places typed keys from internal/auth into the request context.

// NewKeycloakMiddleware returns a middleware that validates bearer tokens using JWKS URL.
func NewKeycloakMiddleware(issuer string, realm string, clientId string) func(http.Handler) http.Handler {
	// create OIDC provider and verifier
	ctx := context.Background()
	provider, err := oidc.NewProvider(ctx, fmt.Sprintf("%s/realms/%s", issuer, realm))
	if err != nil {
		log.Panicf("failed to create OIDC provider from issuer %s: %v", issuer, err)
	}
	log.Printf("created OIDC provider from issuer %s", issuer)

	verifier := provider.Verifier(&oidc.Config{ClientID: clientId})

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				w.WriteHeader(http.StatusUnauthorized)
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(handlers.ErrorResponse{Message: "missing authorization header"})
				return
			}
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				w.WriteHeader(http.StatusUnauthorized)
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(handlers.ErrorResponse{Message: "invalid authorization header"})
				return
			}
			tokenStr := parts[1]

			// verify signature and standard claims using OIDC verifier
			reqCtx := r.Context()
			idToken, err := verifier.Verify(reqCtx, tokenStr)
			if err != nil {
				log.Printf("token verification failed: %v", err)
				w.WriteHeader(http.StatusUnauthorized)
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(handlers.ErrorResponse{Message: "invalid token"})
				return
			}

			// extract claims (we only need sub and preferred_username)
			var tokenClaims struct {
				Sub               string `json:"sub"`
				PreferredUsername string `json:"preferred_username"`
			}
			idToken.Claims(&tokenClaims)

			sub := tokenClaims.Sub
			preferredUsername := tokenClaims.PreferredUsername

			// set typed keys
			ctx := context.WithValue(r.Context(), auth.UserIDKey, sub)
			ctx = context.WithValue(ctx, auth.UsernameKey, preferredUsername)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
