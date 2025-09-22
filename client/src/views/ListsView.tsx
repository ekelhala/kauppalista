import { useEffect, useState } from "react";
import type { List } from "../types/List";
import { deleteList, getLists, getSharedWithMeLists, getPinnedLists, pinList, unpinList } from "../services/listService";
import { Container, Title, Text, Loader, Button, Tabs } from '@mantine/core';
import { AddListDialog } from "../components/AddListDialog";
import { ShareListDialog } from "../components/ShareListDialog";
import ShoppingListItem from '../components/ShoppingListItem';
import { useNavigate } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { AccountMenu } from '../components/AccountMenu';
import { useAuth } from "react-oidc-context";

export const ListsView = () => {
  const navigate = useNavigate();
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
            {/* Account menu shows avatar and logout */}
            <AccountMenu />
          </div>
        </div>
      </div>

  <AddListDialog opened={dialogOpen} onClose={() => setDialogOpen(false)} onListCreated={getAndSetLists} />
  <ShareListDialog opened={shareDialogOpen} onClose={() => { setShareDialogOpen(false); setShareListId(null); }} listId={shareListId} onShared={getAndSetLists} />

      {loading ? (
        <Loader />
      ) : (
        <Tabs defaultValue="pinned" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="pinned">Kiinnitetyt</Tabs.Tab>
            <Tabs.Tab value="my">Omat listat</Tabs.Tab>
            <Tabs.Tab value="shared">Jaettu kanssani</Tabs.Tab>
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
