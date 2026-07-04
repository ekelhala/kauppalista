import type { Item } from '../types/Item';
import { Checkbox, Typography, Card, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Delete as TrashIcon, Add as PlusIcon, Remove as MinusIcon, MoreVert } from '@mui/icons-material';
import { useState } from 'react';
import { decreaseItemQuantity, increaseItemQuantity } from '../services/itemService';

type Props = {
  item: Item;
  onCheck: (id: string, checked: boolean) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

export const ItemRow = ({ item, onCheck, onDelete }: Props) => {
  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const theme = useTheme();

  const dec = () => { setQuantity(q => Math.max(1, q - 1)); decreaseItemQuantity(item.id); }
  const inc = () => { setQuantity(q => q + 1); increaseItemQuantity(item.id); }

  const isDark = theme.palette.mode === 'dark';
  const baseColor = isDark ? theme.palette.grey[700] : alpha(theme.palette.primary.main, 0.08);
  const checkedColor = isDark ? theme.palette.grey[600] : theme.palette.primary.main;

  const cardSx = {
    width: '100%',
    padding: 2,
    mb: 1,
    backgroundColor: item.checked ? checkedColor : baseColor,
    opacity: item.checked ? 0.8 : 1
  };

  return (
    <Card variant="outlined" elevation={0} sx={cardSx}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <Checkbox checked={item.checked} onChange={(e) => onCheck(item.id, e.currentTarget.checked)} />
          <Typography sx={{ wordBreak: 'break-word', textDecoration: item.checked ? 'line-through' : 'none' }}>{item.name}</Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Typography>{quantity}</Typography>
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} aria-label={`more-${item.id}`}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
              onClick={(e) => e.stopPropagation()}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { inc(); setAnchorEl(null); }}>
                <ListItemIcon><PlusIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Lisää" />
              </MenuItem>
              <MenuItem onClick={() => { dec(); setAnchorEl(null); }}>
                <ListItemIcon><MinusIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Vähennä" />
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); onDelete(item.id); }} sx={{ color: 'error.main' }}>
                <ListItemIcon><TrashIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Poista" sx={{ color: 'inherit' }} />
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ItemRow;
