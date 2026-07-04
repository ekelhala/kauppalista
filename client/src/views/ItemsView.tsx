import { useEffect, useState, useRef } from 'react';
import type { Item } from '../types/Item';
import { useTranslation } from 'react-i18next';
import { Typography, Divider, Button, List as MuiList, ListItem, CircularProgress, Fab } from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import { addItem, getItems, checkItem, deleteItem, clearSelectedItems } from '../services/listService';
import ItemRow from '../components/ItemRow';
import { useNavigate } from 'react-router-dom';
import { AddItemDialog } from '../dialogs/AddItemDialog';
import { ListOptionsMenu } from '../components/ListOptionsMenu';

type Props = {
  listId: string;
  listName: string;
}

export const ListView = ({ listId, listName }: Props) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpened, setDialogOpened] = useState(false);
  const [listExists, setListExists] = useState(true);

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
      <Typography variant="h6">{t('items.notFound')}</Typography>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Button color="inherit" onClick={() => { navigate('/') }} startIcon={<ArrowBack />}>{t('items.actions.back')}</Button>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <Typography variant="h6" style={{ margin: 0 }}>{listName}</Typography>
          <ListOptionsMenu onClearSelected={() => handleClearSelected()} />
        </div>
      </div>
      <Divider sx={{ my: 1 }} />
      {loading ? (
        <CircularProgress />
      ) : (
        <MuiList sx={{ marginBottom: 8, width: '100%' }}>
          {items.map(i => (
              <ListItem key={i.id}>
                <ItemRow
                  item={i}
                  onCheck={handleCheck}
                  onDelete={async (id) => {
                    await deleteItem(id);
                    await fetchListItems();
                  }}
                />
              </ListItem>
          ))}
        </MuiList>
      )}
      <Fab color="primary" aria-label={t('items.aria.addItem')} onClick={() => setDialogOpened(true)} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Add />
      </Fab>
      <AddItemDialog
        opened={dialogOpened}
        onClose={() => setDialogOpened(false)}
        onItemAdded={handleAddItem}
      />
    </>
  )
}
