import { useEffect, useState } from 'react';
import type { Item } from '../types/Item';
import { Card, Title, Text, Divider, TextInput, Button, List, Checkbox } from '@mantine/core';
import { addItem, getItems, checkItem } from '../services/shoppingListService';

type Props = {
  listId: string;
  onClose?: () => void;
  listName: string;
}

export const ListView = ({ listId, listName }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');

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
      <Title order={3}>{listName}</Title>
      <Divider my="sm" />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <List spacing="xs">
          {items.map(i => (
            <List.Item component="div" key={i.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Checkbox 
                    defaultChecked={i.checked}
                    onChange={(e) => handleCheck(i.id, e.currentTarget.checked)} />
                  <Text>{i.name}</Text>
                </div>
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
