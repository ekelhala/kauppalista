import { useEffect, useState } from "react";
import type { MouseEvent } from 'react';
import type { List } from "../types/List";
import { deleteList, getLists, getSharedWithMeLists } from "../services/shoppingListService";
import { Container, Title, Card, Badge, Text, Loader, Button, Menu, ActionIcon, Tabs } from '@mantine/core';
import { AddListDialog } from "../components/AddListDialog";
import { ShareListDialog } from "../components/ShareListDialog";
import { useNavigate } from 'react-router-dom';
import { IconTrash, IconDots, IconPlus, IconLogout } from '@tabler/icons-react';
import { useAuth } from "react-oidc-context";

export const ListsView = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<List[]>([]);
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
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => setDialogOpen(true)}>
            <IconPlus style={{ marginRight: 8 }} />
            Uusi
          </Button>
          <Button variant="outline" onClick={async () => {
            try {
              await auth.signoutRedirect();
            } catch (err) {
              // fallback to removing local user if redirect fails
              try { await auth.removeUser(); } catch (e) { console.error('Logout failed', e); }
            }
          }}>
            <IconLogout style={{ marginRight: 8 }} />
            Kirjaudu ulos
          </Button>
        </div>
      </div>

  <AddListDialog opened={dialogOpen} onClose={() => setDialogOpen(false)} onListCreated={getAndSetLists} />
  <ShareListDialog opened={shareDialogOpen} onClose={() => { setShareDialogOpen(false); setShareListId(null); }} listId={shareListId} onShared={getAndSetLists} />

      {loading ? (
        <Loader />
      ) : (
        <Tabs defaultValue="my" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="my">Omat listat</Tabs.Tab>
            <Tabs.Tab value="shared">Jaettu kanssani</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="my">
            {lists.length === 0 ? (
              <Text c="dimmed">Ei listoja</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lists.map(list => (
                  <Card key={list.id} shadow="sm" radius="md" withBorder style={{ cursor: 'pointer' }} onClick={() => navigate(`/lists/${list.id}`, { state: { name: list.name } })}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text style={{ fontWeight: 700 }}>{list.name}</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Badge color="cyan" variant="light">{list.items.length} tuotetta</Badge>
                        <Menu withinPortal>
                          <Menu.Target>
                            <ActionIcon aria-label="Avaa valikko" onClick={(e: MouseEvent) => e.stopPropagation()}>
                              <IconDots size={18} />
                            </ActionIcon>
                          </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); setShareListId(list.id); setShareDialogOpen(true); }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ marginLeft: 8 }}>Jaa</span>
                                </div>
                              </Menu.Item>
                              <Menu.Item color="red" onClick={async (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); await deleteList(list.id); await getAndSetLists(); }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <IconTrash size={16} />
                                  <span style={{ marginLeft: 8 }}>Poista</span>
                                </div>
                              </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                      </div>
                    </div>
                  </Card>
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
                  <Card key={list.id} shadow="sm" radius="md" withBorder style={{ cursor: 'pointer' }} onClick={() => navigate(`/lists/${list.id}`, { state: { name: list.name } })}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text style={{ fontWeight: 700 }}>{list.name}</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Badge color="cyan" variant="light">{list.items.length} tuotetta</Badge>
                        {/* No delete action for shared lists */}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Tabs.Panel>
        </Tabs>
      )}
    </Container>
  )
}

      