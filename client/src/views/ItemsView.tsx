import { useEffect, useState } from 'react';
import type { Item } from '../types/Item';
import { Title, Divider, Button, List, Loader } from '@mantine/core';
import { addItem, getItems, checkItem, deleteItem } from '../services/shoppingListService';
import ItemRow from '../components/ItemRow';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { AddItemDialog } from '../components/AddItemDialog';

type Props = {
  listId: string;
  listName: string;
}

export const ListView = ({ listId, listName }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpened, setDialogOpened] = useState(false);
  const [listExists, setListExists] = useState(true);

  const navigate = useNavigate();

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getItems(listId);
      setItems(res.items);
    }
    catch (e) {
      setListExists(false);
    }
    finally {
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

  const handleAddItem = async (name: string) => {
    if (!name.trim()) return;
    try {
      await addItem(listId, name.trim());
      await fetch();
    } catch (e) {
      console.error("Error adding item:", e);
    }
  }

  useEffect(() => { fetch(); }, [listId]);

  if (!listExists) {
    return (
      <div>
        <Title order={3}>404: listaa ei löydy</Title>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Button variant="subtle" size="xs" onClick={() => { navigate('/') }}>
          <IconArrowLeft size={16} style={{ marginRight: 4 }} />
          Takaisin
        </Button>
        <div>
          <Title order={3} style={{ margin: 0 }}>{listName}</Title>
        </div>
      </div>
      <Divider my="sm" />
      {loading ? (
        <Loader />
      ) : (
        <>
        <List spacing="xs" size="sm" center style={{ marginBottom: 8, width: '100%' }}>
          {items.map(i => (
              <ItemRow
                key={i.id}
                item={i}
                onCheck={handleCheck}
                onDelete={async (id) => {
                  await deleteItem(id);
                  await fetch();
                }}
              />
          ))}
        </List>
        <div style={{ position: 'sticky', bottom: 0, width: '100%', background: 'white', paddingTop: 8, paddingBottom: 8 }}>
          <Button 
            variant='light' 
            size='xs' 
            fullWidth
            onClick={() => setDialogOpened(true)}>
            Lisää tuote <IconPlus size={16} style={{ marginRight: 4 }} />
          </Button>
        </div>
        </>
      )}
      <AddItemDialog
        opened={dialogOpened}
        onClose={() => setDialogOpened(false)}
        onItemAdded={handleAddItem}
      />
    </>
  )
}
