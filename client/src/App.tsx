import { Container, Center, Loader } from '@mantine/core';
import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { ListsView } from './views/ListsView';
import { ListView } from './views/ItemsView';
import { useAuth } from 'react-oidc-context';
import { useEffect, useRef, useState } from 'react';
import { registerTokenGetter } from './services/api';
import SilentRenew from './components/SilentRenew';
import FrontPage from './components/FrontPage';
import type { Theme } from './types/Theme';
import { useMantineColorScheme } from '@mantine/core';

const App = () => {

  const [theme, setTheme] = useState<Theme>('light');
  const { setColorScheme } = useMantineColorScheme();

  const auth = useAuth();
  // Track if we've already attempted a one-time silent signin during this
  // component lifecycle.
  const silentAttemptedRef = useRef(false);

  useEffect(() => {
    // Do not auto-redirect to sign-in on mount; try a silent signin first.
    const href = window.location.href;
    const isCallback = href.includes('code=') || href.includes('state=') || href.includes('session_state=');

    if (!isCallback && !silentAttemptedRef.current && !auth.user && !auth.error) {
      silentAttemptedRef.current = true;
      try {
        auth.signinSilent();
      } catch (e) {
        console.error('Silent signin error', e);
      }
    }

    // Register token getter when authenticated so api can attach Authorization header
    if (!auth.isLoading && auth.isAuthenticated) {
      registerTokenGetter(() => auth.user?.access_token);
    }
  }, [auth]);

  useEffect(() => {
    setColorScheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme, setColorScheme]);

  return (
    <BrowserRouter>
      <Container size="sm" py="xl">
        {auth.isLoading ? (
          <Center style={{ height: '50vh', flexDirection: 'column' }}>
            <Loader />
          </Center>
        ) : auth.isAuthenticated ? (
          <Routes>
            <Route path="/" element={<ListsView theme={theme} setTheme={setTheme} />} />
            <Route path="/lists/:id" element={<ListViewWrapper />} />
            {/* Route used only for silent renew iframe callback */}
            <Route path="/silent-renew" element={<SilentRenew />} />
          </Routes>
        ) : (
          // Not loading, not authenticated, no error -> show front page
          <FrontPage />
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
