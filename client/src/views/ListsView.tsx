import { useEffect, useState } from "react";
import type { List } from "../types/List";
import { deleteList, getLists, getSharedWithMeLists, getPinnedLists, pinList, unpinList } from "../services/listService";
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box, Button, CircularProgress, Drawer, List as MuiList, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, AppBar, Toolbar, IconButton } from '@mui/material';
import { AddListDialog } from "../dialogs/AddListDialog";
import { ShareListDialog } from "../dialogs/ShareListDialog";
import ShoppingLists from '../components/ShoppingLists';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add, Menu as MenuIcon, PushPin, List as ListIcon, Share } from '@mui/icons-material';
import { AccountMenu } from '../components/AccountMenu';
import { useAuth } from "react-oidc-context";
import type { Theme } from "../types/Theme";

type ViewType = 'pinned' | 'my' | 'shared';

export interface ListsViewParams {
    toggle: () => void;
    mode: Theme;
    activeView: ViewType;
    setActiveView: (view: ViewType) => void;
}

export const ListsView = ({ toggle, mode, activeView, setActiveView }: ListsViewParams) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lists, setLists] = useState<List[]>([]);
  const [pinnedLists, setPinnedLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareListId, setShareListId] = useState<string | null>(null);
  const [sharedWithMeLists, setSharedWithMeLists] = useState<List[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    const params = new URLSearchParams(searchParams);
    params.set('tab', view);
    setSearchParams(params, { replace: true });
    handleMenuClose();
  };

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      getAndSetLists();
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (requestedTab === 'pinned' || requestedTab === 'my' || requestedTab === 'shared') {
      setActiveView(requestedTab as ViewType);
    }
  }, [searchParams, setActiveView]);

  const navItems: { value: ViewType; label: string; icon: React.ReactNode; count: number }[] = [
    { value: 'pinned', label: t('lists.tabs.pinned'), icon: <PushPin />, count: pinnedLists.length },
    { value: 'my', label: t('lists.tabs.my'), icon: <ListIcon />, count: lists.length },
    { value: 'shared', label: t('lists.tabs.shared'), icon: <Share />, count: sharedWithMeLists.length },
  ];

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={handleMenuOpen} aria-label={t('lists.aria.openNav')}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" component="h1">{t('lists.title')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button variant="contained" onClick={() => setDialogOpen(true)} startIcon={<Add />}>{t('lists.actions.new')}</Button>
            <AccountMenu onThemeToggle={handleThemeToggle} mode={mode} />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="div">{t('lists.navTitle')}</Typography>
        </Box>
        <Divider />
        <MuiList sx={{ px: 1 }}>
          {navItems.map(item => (
            <ListItem key={item.value} disablePadding>
              <ListItemButton
                selected={activeView === item.value}
                onClick={() => handleViewChange(item.value)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                  {item.count}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </MuiList>
      </Drawer>

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <AddListDialog opened={dialogOpen} onClose={() => setDialogOpen(false)} onListCreated={getAndSetLists} />
        <ShareListDialog opened={shareDialogOpen} onClose={() => { setShareDialogOpen(false); setShareListId(null); }} listId={shareListId} onShared={getAndSetLists} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 50 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeView === 'pinned' && (
              <Box sx={{ py: 2 }}>
                {pinnedLists.length === 0 ? (
                  <Typography color="text.secondary">{t('lists.empty.pinned')}</Typography>
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

            {activeView === 'my' && (
              <Box sx={{ py: 2 }}>
                {lists.length === 0 ? (
                  <Typography color="text.secondary">{t('lists.empty.my')}</Typography>
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

            {activeView === 'shared' && (
              <Box sx={{ py: 2 }}>
                {sharedWithMeLists.length === 0 ? (
                  <Typography color="text.secondary">{t('lists.empty.shared')}</Typography>
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
          </>
        )}
      </Container>
    </>
  )
}
