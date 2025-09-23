import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const ORIGIN = import.meta.env.DEV ? 'http://localhost:5173' : 'https://kauppalista.apps.k3s.kelhala.com';

const userManager = new UserManager({
    authority: "https://keycloak.kelhala.com/realms/kauppalista",
    client_id: "kauppalista-client",
    redirect_uri: `${ORIGIN}`,
    post_logout_redirect_uri: `${ORIGIN}`,
    // Silent renew redirect (must be registered in Keycloak client) - points to an SPA route
    silent_redirect_uri: `${ORIGIN}/silent-renew`,
    // Let the library try to renew access tokens automatically
    automaticSilentRenew: true,
    // Store user in localStorage so state survives reloads
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    response_type: "code",
    // Request offline_access if you want refresh token (Keycloak scope)
    scope: 'openid profile email offline_access',
});

export default userManager;
