import { Container } from '@mantine/core';
import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { ListsView } from './views/ListsView';
import { ListView } from './views/ItemsView';

const App = () => {
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
