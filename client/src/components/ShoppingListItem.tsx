import React from 'react';
import type { MouseEvent } from 'react';
import type { List } from '../types/List';
import { Card, Badge, Menu, ActionIcon, Text } from '@mantine/core';
import { IconDots, IconTrash, IconUserPin } from '@tabler/icons-react';

type Props = {
  list: List;
  onClick?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPinToggle?: (id: string, currentlyPinned: boolean) => void;
  /** When false, both sharing and deletion are disabled */
  isOwner?: boolean;
  isPinned?: boolean;
};

export const ShoppingListItem: React.FC<Props> = ({ list, onClick, onShare, onDelete, isOwner = true, onPinToggle, isPinned = false }) => {
  const stopAnd = (e: MouseEvent, fn?: () => void) => {
    e.stopPropagation();
    fn?.();
  };

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
          {/* Show menu when there is at least one actionable prop: owner actions or pin toggle */}
          {(isOwner || typeof onPinToggle === 'function') ? (
            <Menu withinPortal>
              <Menu.Target>
                <ActionIcon aria-label="Avaa valikko" onClick={(e: MouseEvent) => stopAnd(e)}>
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {/* Owner-only: Share */}
                {isOwner ? (
                  <Menu.Item onClick={(e: MouseEvent) => stopAnd(e, () => onShare?.(list.id))}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginLeft: 8 }}>Jaa</span>
                    </div>
                  </Menu.Item>
                ) : null}

                {/* Pin/unpin available when onPinToggle provided */}
                {typeof onPinToggle === 'function' ? (
                  <Menu.Item onClick={(e: MouseEvent) => stopAnd(e, () => onPinToggle?.(list.id, !!isPinned))}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <IconUserPin size={16} />
                      <span style={{ marginLeft: 8 }}>{isPinned ? 'Poista kiinnitys' : 'Kiinnitä'}</span>
                    </div>
                  </Menu.Item>
                ) : null}

                {/* Owner-only: Delete */}
                {isOwner ? (
                  <Menu.Item color="red" onClick={(e: MouseEvent) => stopAnd(e, () => onDelete?.(list.id))}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <IconTrash size={16} />
                      <span style={{ marginLeft: 8 }}>Poista</span>
                    </div>
                  </Menu.Item>
                ) : null}
              </Menu.Dropdown>
            </Menu>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default ShoppingListItem;
