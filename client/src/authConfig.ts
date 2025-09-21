import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const userManager = new UserManager({
    authority: "https://keycloak.kelhala.com/realms/kauppalista",
    client_id: "kauppalista-client",
    redirect_uri: import.meta.env.DEV ? "http://localhost:5173" : "https://kauppalista.apps.k3s.kelhala.com",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    response_type: "code",
});

export default userManager;
