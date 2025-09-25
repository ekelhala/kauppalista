import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const ORIGIN = import.meta.env.DEV ? 'http://localhost:5173' : 'https://kauppalista.apps.k3s.kelhala.com';
const CLIENT_ID = import.meta.env.DEV ? 'kauppalista-client' : 'kauppalista-client-prod';

const userManager = new UserManager({
    authority: "https://keycloak.kelhala.com/realms/kauppalista",
    client_id: CLIENT_ID,
    redirect_uri: `${ORIGIN}`,
    post_logout_redirect_uri: `${ORIGIN}`,
    // Silent renew redirect (must be registered in Keycloak client) - points to an SPA route
    silent_redirect_uri: `${ORIGIN}/silent-renew`,
    silentRequestTimeoutInSeconds: 20,
    // How long before access token expiry to try to renew (in seconds)
    accessTokenExpiringNotificationTimeInSeconds: 30,
    // Let the library try to renew access tokens automatically
    automaticSilentRenew: true,
    // Store user in localStorage so state survives reloads
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    response_type: "code",
    scope: 'openid profile email',
});

export default userManager;
