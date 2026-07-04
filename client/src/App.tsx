import { Box, Container, CircularProgress } from '@mui/material';
import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { ListsView } from './views/ListsView';
import { ListView } from './views/ItemsView';
import { useAuth } from 'react-oidc-context';
import { useEffect, useRef, useState } from 'react';
import { registerTokenGetter } from './services/api';
import SilentRenew from './components/SilentRenew';
import FrontPage from './components/FrontPage';
import { useColorMode } from './ColorModeProvider';

const App = () => {
  const { mode, toggle } = useColorMode();
  const [activeView, setActiveView] = useState<'pinned' | 'my' | 'shared'>('pinned');

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

  return (
    <BrowserRouter>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {auth.isLoading ? (
          <Box sx={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : auth.isAuthenticated ? (
          <Routes>
            <Route 
              path="/" 
              element={<ListsView 
                          mode={mode} 
                          toggle={toggle} 
                          activeView={activeView} 
                          setActiveView={setActiveView} />} />
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
