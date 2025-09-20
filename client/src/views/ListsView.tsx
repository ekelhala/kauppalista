import { useEffect, useState } from "react";
import type { MouseEvent } from 'react';
import type { List } from "../types/List";
import { deleteList, getLists } from "../services/shoppingListService";
import { Container, Title, Card, Badge, Text, Loader, Button, Menu, ActionIcon } from '@mantine/core';
import { AddListDialog } from "../components/AddListDialog";
import { useNavigate } from 'react-router-dom';
import { IconTrash, IconDots } from '@tabler/icons-react';

export const ListsView = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getAndSetLists = async () => {
    setLoading(true);
    try {
      const listData = await getLists();
      setLists(listData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getAndSetLists(); }, []);

  return (
    <Container size="sm" py="xl">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title order={1}>Kauppalistat</Title>
        <Button onClick={() => setDialogOpen(true)}>Uusi lista</Button>
      </div>

      <AddListDialog opened={dialogOpen} onClose={() => setDialogOpen(false)} onListCreated={getAndSetLists} />

      {loading ? (
        <Loader />
      ) : (
        lists.length === 0 ? (
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
                        <Menu.Item color="red" onClick={async (e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); await deleteList(list.id); await getAndSetLists(); }}>
                          <IconTrash size={16} />
                          <span style={{ marginLeft: 8 }}>Poista</span>
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </Container>
  )
}
