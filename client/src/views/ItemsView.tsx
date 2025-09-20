import { useEffect, useState } from 'react';
import type { Item } from '../types/Item';
import { Card, Title, Divider, TextInput, Button, List, Loader } from '@mantine/core';
import { addItem, getItems, checkItem, deleteItem } from '../services/shoppingListService';
import ItemRow from '../components/ItemRow';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';

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
    // optimistic update
    setItems(prev => prev.map(it => it.id === itemId ? { ...it, checked } : it));
    try {
      await checkItem(itemId, checked);
    } catch (e) {
      // revert on error
      setItems(prev => prev.map(it => it.id === itemId ? { ...it, checked: !checked } : it));
    }
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
              <ItemRow
                item={i}
                onCheck={handleCheck}
                onDelete={async (id) => {
                  await deleteItem(id);
                  await fetch();
                }}
              />
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
