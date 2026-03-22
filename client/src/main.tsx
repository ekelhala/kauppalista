import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import '@mantine/core/styles.css';
import './theme.css';
import {AuthProvider} from 'react-oidc-context'
import { createTheme, MantineProvider } from '@mantine/core';

import userManager from './authConfig.ts';

const appTheme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 7, dark: 5 },
  colors: {
    brand: [
      '#e9f5ee',
      '#d6eadf',
      '#bedfcd',
      '#a4d4ba',
      '#8ac9a6',
      '#70be92',
      '#58b37f',
      '#40916c',
      '#2d6a4f',
      '#1b4332',
    ],
  },
});

// If we were redirected back from the identity provider the URL will contain
// parameters like `code` and `state`. Process the callback with the user
// manager so the library can store tokens, then remove the long query string
// from the browser history to give the user a clean URL.
async function handleOidcRedirect() {
  try {
    const href = window.location.href;
    // Only process the interactive redirect callback in the top-level window.
    // Silent renew callbacks will be delivered to the `silent_redirect_uri` and
    // handled inside the iframe by a route/component.
    if (window.parent === window && (href.includes('code=') || href.includes('state=') || href.includes('session_state='))) {
      // Let oidc-client-ts process the redirect response
      await userManager.signinRedirectCallback();
      // Replace the URL with a clean one (same origin + pathname)
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (err) {
    // Don't block the app if callback processing fails; log for debugging.
    // eslint-disable-next-line no-console
    console.error('OIDC callback processing failed', err);
  }
}

// Start callback handling immediately (fire-and-forget)
void handleOidcRedirect();

// Register PWA service worker and allow background updates.
const updateSW = registerSW({
  immediate: true,
});

void updateSW;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={appTheme}>
      <AuthProvider userManager={userManager}>
      <App />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
)
