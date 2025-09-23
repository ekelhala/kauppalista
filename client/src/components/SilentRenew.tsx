import { useEffect } from 'react';
import userManager from '../authConfig';

// This component is mounted inside the silent renew iframe at /silent-renew
// and lets oidc-client-ts process the callback there.
export default function SilentRenew() {
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Process the signin callback inside the iframe; library will update storage
        await userManager.signinSilentCallback();
      } catch (err) {
        // Log error for diagnostics
        // eslint-disable-next-line no-console
        console.error('Silent renew callback failed', err);
      } finally {
        // Try to close the iframe by navigating away; if running in an iframe,
        // the parent page will continue. Keep this no-op safe for top-level.
        try {
          if (mounted && window.parent && window.parent !== window) {
            // Remove iframe's location to a blank page
            window.location.href = 'about:blank';
          }
        } catch {
          // ignore
        }
      }
    })();

    return () => { mounted = false };
  }, []);

  return null;
}
