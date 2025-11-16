import { useEffect, useState } from "react";
import type { List } from "../types/List";
import { deleteList, getLists, getSharedWithMeLists, getPinnedLists, pinList, unpinList } from "../services/listService";
import { Container, Title, Text, Loader, Button, Tabs, useMantineTheme } from '@mantine/core';
import { AddListDialog } from "../dialogs/AddListDialog";
import { ShareListDialog } from "../dialogs/ShareListDialog";
import ShoppingListItem from '../components/ShoppingListItem';
import { useNavigate } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { AccountMenu } from '../components/AccountMenu';
import { useAuth } from "react-oidc-context";
import type { Theme } from "../types/Theme";

export interface ListsViewParams {
    setTheme: (theme: Theme) => void;
    theme: Theme;
}

export const ListsView = ({ setTheme, theme }: ListsViewParams) => {
  const navigate = useNavigate();
  const mantineTheme = useMantineTheme();
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
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      getAndSetLists();
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  return (
    <Container size="sm" py="xl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title order={1}>Listat</Title>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button onClick={() => setDialogOpen(true)}>
            <IconPlus style={{ marginRight: 8 }} />
            Uusi
          </Button>
          <div>
            <AccountMenu 
              onThemeToggle={handleThemeToggle} 
              theme={theme} 
            />
          </div>
        </div>
      </div>

  <AddListDialog opened={dialogOpen} onClose={() => setDialogOpen(false)} onListCreated={getAndSetLists} />
  <ShareListDialog opened={shareDialogOpen} onClose={() => { setShareDialogOpen(false); setShareListId(null); }} listId={shareListId} onShared={getAndSetLists} />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
        <Loader />
        </div>
      ) : (
        <Tabs defaultValue="pinned" 
              keepMounted={false} 
              variant="outline">
          <Tabs.List mb={"md"} style={{ display: 'flex',
                                        flexWrap: 'nowrap',
                                        overflowX: 'auto',
                                        gap: 8,
                                        whiteSpace: 'nowrap',
                                        WebkitOverflowScrolling: 'touch'
                                        }}>
            <Tabs.Tab value="pinned">
              Kiinnitetyt (
              <span style={{ color: mantineTheme.colors[mantineTheme.primaryColor][6] }}>{pinnedLists.length}</span>
              )
            </Tabs.Tab>
            <Tabs.Tab value="my">
              Omat (
              <span style={{ color: mantineTheme.colors[mantineTheme.primaryColor][6] }}>{lists.length}</span>
              )
            </Tabs.Tab>
            <Tabs.Tab value="shared">
              Jaettu kanssani (
              <span style={{ color: mantineTheme.colors[mantineTheme.primaryColor][6] }}>{sharedWithMeLists.length}</span>
              )
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pinned">
            {pinnedLists.length === 0 ? (
              <Text c="dimmed">Ei kiinnitettyjä listoja</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pinnedLists.map(list => (
                  <ShoppingListItem
                    key={list.id}
                    list={list}
                    onClick={(id: string) => navigate(`/lists/${id}`, { state: { name: list.name } })}
                    onShare={(id: string) => { setShareListId(id); setShareDialogOpen(true); }}
                    onDelete={async (id: string) => { await deleteList(id); await getAndSetLists(); }}
                    isOwner={true}
                    isPinned={true}
                    onPinToggle={async (id: string, currentlyPinned: boolean) => {
                      if (currentlyPinned) await unpinList(id); else await pinList(id);
                      await getAndSetLists();
                    }}
                  />
                ))}
              </div>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="my">
            {lists.length === 0 ? (
              <Text c="dimmed">Ei listoja</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lists.map(list => (
                  <ShoppingListItem
                    key={list.id}
                    list={list}
                    onClick={(id: string) => navigate(`/lists/${id}`, { state: { name: list.name } })}
                    onShare={(id: string) => { setShareListId(id); setShareDialogOpen(true); }}
                    onDelete={async (id: string) => { await deleteList(id); await getAndSetLists(); }}
                    isOwner={true}
                    isPinned={pinnedLists.some(p => p.id === list.id)}
                    onPinToggle={async (id: string, currentlyPinned: boolean) => {
                      if (currentlyPinned) await unpinList(id); else await pinList(id);
                      await getAndSetLists();
                    }}
                  />
                ))}
              </div>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="shared">
            {sharedWithMeLists.length === 0 ? (
              <Text c="dimmed">Ei jaettuja listoja</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sharedWithMeLists.map(list => (
                  <ShoppingListItem
                    key={list.id}
                    list={list}
                    onClick={(id: string) => navigate(`/lists/${id}`, { state: { name: list.name } })}
                    onShare={() => undefined}
                    isOwner={false}
                    isPinned={pinnedLists.some(p => p.id === list.id)}
                    onPinToggle={async (id: string, currentlyPinned: boolean) => {
                      if (currentlyPinned) await unpinList(id); else await pinList(id);
                      await getAndSetLists();
                    }}
                  />
                ))}
              </div>
            )}
          </Tabs.Panel>
        </Tabs>
      )}
    </Container>
  )
}
