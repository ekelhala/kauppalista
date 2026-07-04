import { useEffect, useState } from "react";
import type { List } from "../types/List";
import { deleteList, getLists, getSharedWithMeLists, getPinnedLists, pinList, unpinList } from "../services/listService";
import { Container, Typography, Box, Button, Tabs, Tab, CircularProgress } from '@mui/material';
import { AddListDialog } from "../dialogs/AddListDialog";
import { ShareListDialog } from "../dialogs/ShareListDialog";
import ShoppingLists from '../components/ShoppingLists';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { AccountMenu } from '../components/AccountMenu';
import { useAuth } from "react-oidc-context";
import type { Theme } from "../types/Theme";

export interface ListsViewParams {
    toggle: () => void;
    mode: Theme;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const ListsView = ({ toggle, mode, activeTab, setActiveTab }: ListsViewParams) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lists, setLists] = useState<List[]>([]);
  const [pinnedLists, setPinnedLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareListId, setShareListId] = useState<string | null>(null);
  const [sharedWithMeLists, setSharedWithMeLists] = useState<List[]>([]);
  const auth = useAuth();

  const getAndSetLists = async () => {
    setLoading(true);
    try {
      const listData = await getLists();
      setLists(listData);
      const pinnedData = await getPinnedLists();
      setPinnedLists(pinnedData);
      const sharedListsData = await getSharedWithMeLists();
      setSharedWithMeLists(sharedListsData);
    } finally {
      setLoading(false);
    }
  }

  const handleThemeToggle = () => {
    toggle();
  }

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      getAndSetLists();
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (requestedTab === 'pinned' || requestedTab === 'my' || requestedTab === 'shared') {
      setActiveTab(requestedTab);
    }
  }, [searchParams, setActiveTab]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Listat</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button variant="contained" onClick={() => setDialogOpen(true)} startIcon={<Add />}>Uusi</Button>
          <AccountMenu onThemeToggle={handleThemeToggle} mode={mode} />
        </Box>
      </Box>

      <AddListDialog opened={dialogOpen} onClose={() => setDialogOpen(false)} onListCreated={getAndSetLists} />
      <ShareListDialog opened={shareDialogOpen} onClose={() => { setShareDialogOpen(false); setShareListId(null); }} listId={shareListId} onShared={getAndSetLists} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 50 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Tabs variant="standard" value={activeTab} onChange={(_, value) => {
          const nextTab = value ? value : 'pinned';
          setActiveTab(nextTab);
          const params = new URLSearchParams(searchParams);
          params.set('tab', nextTab);
          setSearchParams(params, { replace: true });
        }}>
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: 1, whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
            <Tab value="pinned" label={`Kiinnitetyt (<Typography component="span" color="primary">{pinnedLists.length}</Typography>)`} />
            <Tab value="my" label={`Omat (<Typography component="span" color="primary">{lists.length}</Typography>)`} />
            <Tab value="shared" label={`Jaettu kanssani (<Typography component="span" color="primary">{sharedWithMeLists.length}</Typography>)`} />
          </Box>

          {activeTab === 'pinned' && (
            <Box sx={{ py: 2 }}>
              {pinnedLists.length === 0 ? (
                <Typography color="text.secondary">Ei kiinnitettyjä listoja</Typography>
              ) : (
                <ShoppingLists
                  lists={pinnedLists}
                  onListSelect={(id: string) => navigate(`/lists/${id}`, { state: { name: pinnedLists.find(l => l.id === id)?.name } })}
                  onListShare={(id: string) => { setShareListId(id); setShareDialogOpen(true); }}
                  onListDelete={async (id: string) => { await deleteList(id); await getAndSetLists(); }}
                  isListPinned={() => true}
                  onListTogglePinned={async (id: string) => { await unpinList(id); await getAndSetLists(); }}
                  isListOwner={() => true}
                />
              )}
            </Box>
          )}

          {activeTab === 'my' && (
            <Box sx={{ py: 2 }}>
              {lists.length === 0 ? (
                <Typography color="text.secondary">Ei listoja</Typography>
              ) : (
                <ShoppingLists
                  lists={lists}
                  onListSelect={(id: string) => navigate(`/lists/${id}`, { state: { name: lists.find(l => l.id === id)?.name } })}
                  onListShare={(id: string) => { setShareListId(id); setShareDialogOpen(true); }}
                  onListDelete={async (id: string) => { await deleteList(id); await getAndSetLists(); }}
                  isListPinned={(id: string) => pinnedLists.some(p => p.id === id)}
                  onListTogglePinned={async (id: string) => {
                    const isPinned = pinnedLists.some(p => p.id === id);
                    if (isPinned) await unpinList(id); else await pinList(id);
                    await getAndSetLists();
                  }}
                  isListOwner={() => true}
                />
              )}
            </Box>
          )}

          {activeTab === 'shared' && (
            <Box sx={{ py: 2 }}>
              {sharedWithMeLists.length === 0 ? (
                <Typography color="text.secondary">Ei jaettuja listoja</Typography>
              ) : (
                <ShoppingLists
                  lists={sharedWithMeLists}
                  onListSelect={(id: string) => navigate(`/lists/${id}`, { state: { name: sharedWithMeLists.find(l => l.id === id)?.name } })}
                  onListShare={() => undefined}
                  onListDelete={() => undefined}
                  isListPinned={(id: string) => pinnedLists.some(p => p.id === id)}
                  onListTogglePinned={async (id: string) => {
                    const isPinned = pinnedLists.some(p => p.id === id);
                    if (isPinned) await unpinList(id); else await pinList(id);
                    await getAndSetLists();
                  }}
                  isListOwner={() => false}
                />
              )}
            </Box>
          )}
        </Tabs>
      )}
    </Container>
  )
}
