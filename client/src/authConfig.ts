import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const ORIGIN = window.location.origin;
const AUTHORITY = import.meta.env.VITE_AUTH_AUTHORITY ?? "https://your-tenant.auth0.com";
const CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID ?? "your-spa-client-id";
const SCOPE = import.meta.env.VITE_AUTH_SCOPE ?? "openid profile email";
const AUDIENCE = import.meta.env.VITE_AUTH_AUDIENCE;

const userManager = new UserManager({
    authority: AUTHORITY,
    client_id: CLIENT_ID,
    redirect_uri: `${ORIGIN}`,
    post_logout_redirect_uri: `${ORIGIN}`,
    // Silent renew redirect must be registered in the identity provider app settings.
    silent_redirect_uri: `${ORIGIN}/silent-renew`,
    silentRequestTimeoutInSeconds: 20,
    // How long before access token expiry to try to renew (in seconds)
    accessTokenExpiringNotificationTimeInSeconds: 30,
    // Let the library try to renew access tokens automatically
    automaticSilentRenew: true,
    // Store user in localStorage so state survives reloads
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    response_type: "code",
    scope: SCOPE,
    ...(AUDIENCE ? { extraQueryParams: { audience: AUDIENCE } } : {}),
});

export default userManager;
