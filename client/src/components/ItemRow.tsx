import type { Item } from '../types/Item';
import { Checkbox, Text, Card, ActionIcon, Menu } from '@mantine/core';
import { IconTrash, IconPlus, IconMinus, IconDotsVertical } from '@tabler/icons-react';
import { useState } from 'react';
import { decreaseItemQuantity, increaseItemQuantity } from '../services/itemService';

type Props = {
  item: Item;
  onCheck: (id: string, checked: boolean) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

export const ItemRow = ({ item, onCheck, onDelete }: Props) => {
  const [quantity, setQuantity] = useState<number>(item.quantity);

  const dec = () => {
    setQuantity(q => Math.max(1, q - 1));
    decreaseItemQuantity(item.id);
  }
  const inc = () => {
    setQuantity(q => q + 1);
    increaseItemQuantity(item.id);
}

  return (
    <Card radius="sm" shadow="sm" withBorder 
      style={{ width: '100%', padding: 8, marginBottom: 4, backgroundColor: item.checked ? 'var(--mantine-color-gray-0, #f8f9fa)' : 'white', opacity: item.checked ? 0.6 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <Checkbox
            checked={item.checked}
            onChange={(e) => onCheck(item.id, e.currentTarget.checked)}
          />
          <Text style={{ wordBreak: 'break-word' }}>{item.name}</Text>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text>{quantity}</Text>
            <Menu withArrow position="left">
              <Menu.Target>
                <ActionIcon size="sm" variant="light" aria-label={`more-${item.id}`}>
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={inc}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><IconPlus size={16} />Lisää</span></Menu.Item>
                <Menu.Item onClick={dec}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><IconMinus size={16} />Vähennä</span></Menu.Item>
                <Menu.Item onClick={() => onDelete(item.id)}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--mantine-color-red-6, red)' }}><IconTrash size={16} />Poista</span></Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ItemRow;
