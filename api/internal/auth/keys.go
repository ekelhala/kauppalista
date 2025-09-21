package auth

import "context"

type ctxKey string

const (
	UserIDKey   ctxKey = "userID"
	UsernameKey ctxKey = "username"
)

func UserIDFromContext(ctx context.Context) string {
	if v := ctx.Value(UserIDKey); v != nil {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return ""
}

func UsernameFromContext(ctx context.Context) string {
	if v := ctx.Value(UsernameKey); v != nil {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return ""
}
