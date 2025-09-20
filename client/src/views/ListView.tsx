import { useEffect, useState } from 'react';
import type { Item } from '../types/Item';
import { Card, Title, Text, Divider, TextInput, Button, List, Checkbox, Loader } from '@mantine/core';
import { addItem, getItems, checkItem, deleteItem } from '../services/shoppingListService';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconTrash } from '@tabler/icons-react';

type Props = {
  listId: string;
  listName: string;
}

export const ListView = ({ listId, listName }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');

  const navigate = useNavigate();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getItems(listId);
      setItems(res.items);
    } finally {
      setLoading(false);
    }
  }

  const handleCheck = async (itemId: string, checked: boolean) => {
    await checkItem(itemId, checked);
  }

  useEffect(() => { fetch(); }, [listId]);

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Button variant="subtle" size="xs" onClick={() => { navigate('/') }}>
          <IconArrowLeft style={{ marginRight: 4 }} />
          Takaisin
        </Button>
        <Title order={3} style={{ margin: 0 }}>{listName}</Title>
      </div>
      <Divider my="sm" />
      {loading ? (
        <Loader />
      ) : (
        <List spacing="xs" size="sm" center style={{ marginBottom: 8, width: '100%' }}>
          {items.map(i => (
            <List.Item component="div" key={i.id} style={{ padding: 4, width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <Checkbox
                    defaultChecked={i.checked}
                    onChange={(e) => handleCheck(i.id, e.currentTarget.checked)} />
                  <Text>{i.name}</Text>
                </div>
                <Button variant="subtle" size="xs" color="red" onClick={async () => {
                  await deleteItem(i.id);
                  await fetch();
                }}>
                  <IconTrash style={{ marginRight: 4 }} />
                </Button>
              </div>
            </List.Item>
          ))}
        </List>
      )}

      <Divider my="sm" />
      <div style={{ display: 'flex', gap: 8 }}>
        <TextInput placeholder="Uusi tuote" value={newItemName} onChange={(e) => setNewItemName(e.currentTarget.value)} />
        <Button
          onClick={async () => {
            if (!newItemName.trim()) return;
            await addItem(listId, newItemName.trim());
            setNewItemName('');
            await fetch();
          }}
        >Lisää</Button>
      </div>
    </Card>
  )
}
