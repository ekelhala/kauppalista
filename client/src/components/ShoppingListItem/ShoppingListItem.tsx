import type { List } from '../../types/List';
import { Card, Badge, Text } from '@mantine/core';
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

  return (
    <Card
      key={list.id}
      shadow="sm"
      radius="md"
      withBorder
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={() => onClick?.(list.id)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text style={{ fontWeight: 700 }}>{list.name}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge color="cyan" variant="light">{list.items.length} tuotetta</Badge>
          <ListItemMenu
            list={list}
            onShare={onShare}
            onDelete={onDelete}
            onPinToggle={onPinToggle}
            isPinned={isPinned} />
        </div>
      </div>
    </Card>
  );
};

export default ShoppingListItem;
