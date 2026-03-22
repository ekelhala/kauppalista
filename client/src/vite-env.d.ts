/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
	readonly VITE_AUTH_AUTHORITY?: string;
	readonly VITE_AUTH_CLIENT_ID?: string;
	readonly VITE_AUTH_SCOPE?: string;
	readonly VITE_AUTH_AUDIENCE?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
