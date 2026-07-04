import type { List } from '../../types/List';
import { List as MuiList, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { PinEnd } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ListItemMenu } from './ListItemMenu';

type Props = {
  list: List;
  onClick?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPinToggle?: (id: string, currentlyPinned: boolean) => void;
  isOwner?: boolean;
  isPinned?: boolean;
};

export const ShoppingListItem = ({ list,
                                    onClick,
                                    onShare,
                                    onDelete,
                                    onPinToggle,
                                    isPinned = false }: Props) => {
  const { t } = useTranslation();
  const initial = (list.name || '?').charAt(0).toUpperCase();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MuiList dense={false}>
      <ListItem
        key={list.id}
        disableGutters={false}
        sx={{
          py: 2,
          px: 2,
          cursor: onClick ? 'pointer' : 'default',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        secondaryAction={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isPinned && (
              <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                <PinEnd color="primary" />
              </ListItemIcon>
            )}
            <ListItemMenu
              list={list}
              onShare={onShare}
              onDelete={onDelete}
              onPinToggle={onPinToggle}
              onOpenChange={setMenuOpen}
              isPinned={isPinned} />
          </div>
        }
        onClick={() => { if (menuOpen) return; onClick?.(list.id); }}
      >
        <ListItemAvatar>
          <Chip
            label={initial}
            color="primary"
            variant="outlined"
            sx={{ width: 40, height: 40, minWidth: 40, fontSize: 16, fontWeight: 700 }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={list.name}
          secondary={t('lists.badge.itemCount', { count: list.items.length })}
          slotProps={{
            primary: { sx: { fontWeight: 600 } },
            secondary: { sx: { color: 'text.secondary' } },
          }}
        />
      </ListItem>
    </MuiList>
  );
};

export default ShoppingListItem;
