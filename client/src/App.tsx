import { Container, Center, Loader, Text } from '@mantine/core';
import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { ListsView } from './views/ListsView';
import { ListView } from './views/ItemsView';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { registerTokenGetter } from './services/api';
import SilentRenew from './components/SilentRenew';

const App = () => {

  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.user && !auth.error) {
      // If user not present start interactive signin
      auth.signinRedirect();
    }

    // Fallback: if auth stays loading for too long (e.g. silent renew blocked or
    // storage is stale) trigger a normal redirect login. Don't do this while
    // processing an OIDC callback (URL contains code/state/session_state).
    const href = window.location.href;
    const isCallback = href.includes('code=') || href.includes('state=') || href.includes('session_state=');
    let fallbackTimer: number | undefined;
    if (auth.isLoading && !isCallback) {
      // After 5s of loading, if still no user / error, start interactive signin.
      fallbackTimer = window.setTimeout(() => {
        if (auth.isLoading && !auth.user && !auth.error) {
          auth.signinRedirect();
        }
      }, 5000);
    }

    // Register token getter when authenticated so api can attach Authorization header
    if (!auth.isLoading && auth.isAuthenticated) {
      registerTokenGetter(() => auth.user?.access_token);
    }

    return () => {
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, [auth]);

  return (
    <BrowserRouter>
      <Container size="sm" py="xl">
        {auth.isLoading ? (
          <Center style={{ height: '50vh', flexDirection: 'column' }}>
            <Loader />
          </Center>
        ) : auth.isAuthenticated ? (
          <Routes>
            <Route path="/" element={<ListsView />} />
            <Route path="/lists/:id" element={<ListViewWrapper />} />
            {/* Route used only for silent renew iframe callback */}
            <Route path="/silent-renew" element={<SilentRenew />} />
          </Routes>
        ) : auth.error ? (
          <Center style={{ height: '50vh', flexDirection: 'column' }}>
            <Text color="red">Authentication error. Please sign in.</Text>
            <Text mt="md" onClick={() => auth.signinRedirect()} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Sign in</Text>
          </Center>
        ) : (
          <Center style={{ height: '50vh', flexDirection: 'column' }}>
            <Text>Redirecting to sign-in...</Text>
          </Center>
        )}
      </Container>
    </BrowserRouter>
  )
}

function ListViewWrapper() {
  const { id } = useParams();
  const location = useLocation();
  type LocState = { name?: string } | null;
  const state = location.state as LocState;
  const name = state?.name;
  if (!id) return null;
  return <ListView listId={id} listName={name ?? id} />;
}

export default App
