import type { List } from '../../types/List';
import { List as MuiList, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Chip, useTheme } from '@mui/material';
import { PinEnd } from '@mui/icons-material';
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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const initial = (list.name || '?').charAt(0).toUpperCase();

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
          borderColor: isDark ? 'divider' : 'primary.light',
          backgroundColor: isDark ? 'background.paper' : 'background.default',
          '&:hover': {
            backgroundColor: isDark ? 'action.hover' : 'action.selected',
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
              isPinned={isPinned} />
          </div>
        }
        onClick={() => onClick?.(list.id)}
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
          secondary={`${list.items.length} tuotetta`}
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
