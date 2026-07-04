import type { List } from '../../types/List';
import { Card, CardActionArea, Typography, Chip, useTheme } from '@mui/material';
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
  const bgColor = isDark ? theme.palette.grey[700] : 'var(--mui-palette-primary-light, #e3f2fd)';

  return (
    <Card
      key={list.id}
      variant="outlined"
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: bgColor,
      }}
    >
      <CardActionArea onClick={() => onClick?.(list.id)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{list.name}</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Chip size="small" color="primary" variant="outlined" label={`${list.items.length} tuotetta`} />
            <ListItemMenu
              list={list}
              onShare={onShare}
              onDelete={onDelete}
              onPinToggle={onPinToggle}
              isPinned={isPinned} />
          </div>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default ShoppingListItem;
