import { ActionIcon, Menu } from '@mantine/core';
import type { MouseEvent } from 'react';
import type { List } from '../../types/List';
import { IconDots, IconTrash, IconPin, IconShare, IconPinnedOff } from '@tabler/icons-react';

type Props = {
    list: List;
    onShare?: (id: string) => void;
    onDelete?: (id: string) => void;
    onPinToggle?: (id: string, currentlyPinned: boolean) => void;
    /** When false, both sharing and deletion are disabled */
    isPinned?: boolean;
};

const stopAnd = (e: MouseEvent, fn?: () => void) => {
    e.stopPropagation();
    fn?.();
};

export const ListItemMenu = ({ list, 
                               onShare, 
                               onDelete, 
                               onPinToggle, 
                               isPinned }: Props) => {
    return (
        <Menu withinPortal withArrow>
            <Menu.Target>
            <ActionIcon aria-label="Avaa valikko" onClick={(e: MouseEvent) => stopAnd(e)}>
                <IconDots size={18} />
            </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
            {/* Owner-only: Share */}
            {list.isOwner ? (
                <Menu.Item onClick={(e: MouseEvent) => stopAnd(e, () => onShare?.(list.id))}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconShare size={16} />
                    <span style={{ marginLeft: 8 }}>Jaa</span>
                </div>
                </Menu.Item>
            ) : null}

                <Menu.Item onClick={(e: MouseEvent) => stopAnd(e, () => onPinToggle?.(list.id, !!isPinned))}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isPinned ? <IconPinnedOff size={16} /> : <IconPin size={16} />}
                    <span style={{ marginLeft: 8 }}>{isPinned ? 'Poista kiinnitys' : 'Kiinnitä'}</span>
                </div>
                </Menu.Item>

            {/* Owner-only: Delete */}
            {list.isOwner ? (
                <Menu.Item color="red" onClick={(e: MouseEvent) => stopAnd(e, () => onDelete?.(list.id))}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconTrash size={16} />
                    <span style={{ marginLeft: 8 }}>Poista</span>
                </div>
                </Menu.Item>
            ) : null}
            </Menu.Dropdown>
        </Menu>
    )
}