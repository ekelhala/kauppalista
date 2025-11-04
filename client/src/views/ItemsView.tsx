import { useEffect, useState, useRef } from 'react';
import type { Item } from '../types/Item';
import { Title, Divider, Button, List, Loader, useMantineColorScheme } from '@mantine/core';
import { addItem, getItems, checkItem, deleteItem, clearSelectedItems } from '../services/listService';
import ItemRow from '../components/ItemRow';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { AddItemDialog } from '../components/AddItemDialog';
import { ListOptionsMenu } from '../components/ListOptionsMenu';

type Props = {
  listId: string;
  listName: string;
}

export const ListView = ({ listId, listName }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpened, setDialogOpened] = useState(false);
  const [listExists, setListExists] = useState(true);
  const { colorScheme } = useMantineColorScheme();

  const navigate = useNavigate();

  const sortItems = (arr: Item[]) =>
    [...arr].sort((a, b) => Number(a.checked) - Number(b.checked));

  const reorderDelay = 300; // ms to wait before moving checked items
  const timersRef = useRef<Record<string, number>>({});

  const fetchListItems = async () => {
    setLoading(true);
    try {
      const res = await getItems(listId);
      setItems(sortItems(res.items));
    }
    catch {
      setListExists(false);
    }
    finally {
      setLoading(false);
    }
  }

  const handleCheck = async (itemId: string, checked: boolean) => {
    // optimistic immediate checkbox update (preserve order so user sees the check)
    setItems(prev => prev.map(it => it.id === itemId ? { ...it, checked } : it));

    // clear any existing timer for this item
    if (timersRef.current[itemId]) {
      clearTimeout(timersRef.current[itemId]);
      delete timersRef.current[itemId];
    }

    // delay reordering so user can see the checkbox change before item moves
    timersRef.current[itemId] = window.setTimeout(() => {
      setItems(prev => sortItems([...prev]));
      delete timersRef.current[itemId];
    }, reorderDelay);

    try {
      await checkItem(itemId, checked);
    } catch {
      // clear pending reorder and revert optimistic change on error
      if (timersRef.current[itemId]) {
        clearTimeout(timersRef.current[itemId]);
        delete timersRef.current[itemId];
      }
      setItems(prev => prev.map(it => it.id === itemId ? { ...it, checked: !checked } : it));
    }
  }

  const handleAddItem = async (name: string) => {
    if (!name.trim()) return;
    try {
      await addItem(listId, name.trim());
      await fetchListItems();
    } catch (err) {
      console.error("Error adding item:", err);
    }
  }

  const handleClearSelected = async () => {
    try {
      await clearSelectedItems(listId);
      await fetchListItems();
    } catch (err) {
      console.error("Error clearing selected items:", err);
    }
  }

  useEffect(() => {
    fetchListItems();
    return () => {
      // clear any pending timers on unmount to avoid state updates after unmount
      Object.values(timersRef.current).forEach(id => clearTimeout(id));
      timersRef.current = {};
    };
  }, [listId]);

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
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <Title order={3} style={{ margin: 0 }}>{listName}</Title>
          <ListOptionsMenu onClearSelected={() => handleClearSelected()} />
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
                  await fetchListItems();
                }}
              />
          ))}
        </List>
        <div style={{ 
          position: 'sticky', 
          bottom: 0, 
          width: '100%', 
          background: colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-white)', 
          paddingTop: 8, 
          paddingBottom: 8 
        }}>
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
