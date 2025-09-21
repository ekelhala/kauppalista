import { Container } from '@mantine/core';
import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { ListsView } from './views/ListsView';
import { ListView } from './views/ItemsView';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { registerTokenGetter } from './services/api';

const App = () => {

  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.user && !auth.error) {
      auth.signinRedirect();
    }

    // Register token getter when authenticated so api can attach Authorization header
    if (!auth.isLoading && auth.isAuthenticated) {
      registerTokenGetter(() => auth.user?.access_token);
    }
  }, [auth]);

  return (
    <BrowserRouter>
      <Container size="sm" py="xl">
        <Routes>
          <Route path="/" element={<ListsView />} />
          <Route path="/lists/:id" element={<ListViewWrapper />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

function ListViewWrapper() {
  const { id } = useParams();
  const location = useLocation();
  const name = (location.state as any)?.name as string | undefined;
  if (!id) return null;
  return <ListView listId={id} listName={name ?? id} />;
}

export default App
