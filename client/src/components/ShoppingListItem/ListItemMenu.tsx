import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreHoriz, Delete, PushPin, PushPinOutlined, Share } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { MouseEvent } from 'react';
import type { List } from '../../types/List';
import { useState } from 'react';

type Props = {
    list: List;
    onShare?: (id: string) => void;
    onDelete?: (id: string) => void;
    onPinToggle?: (id: string, currentlyPinned: boolean) => void;
    onOpenChange?: (open: boolean) => void;
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
                               onOpenChange,
                               isPinned }: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { t } = useTranslation();

    const openMenu = (el: HTMLElement) => { setAnchorEl(el); onOpenChange?.(true); };
    const close = () => { setAnchorEl(null); onOpenChange?.(false); };

    return (
        <>
            <IconButton
                onClick={(e: MouseEvent) => stopAnd(e, () => openMenu(e.currentTarget as HTMLElement))}
                aria-label={t('items.aria.openMenu')}
                aria-controls={open ? 'list-item-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <MoreHoriz />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="list-item-menu"
                open={open}
                onClose={close}
                onClick={close}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {list.isOwner ? (
                    <MenuItem onClick={(e: MouseEvent) => stopAnd(e, () => { onShare?.(list.id); close(); })}>
                        <ListItemIcon><Share fontSize="small" /></ListItemIcon>
                        <ListItemText primary={t('lists.menu.share')} />
                    </MenuItem>
                ) : null}
                <MenuItem onClick={(e: MouseEvent) => stopAnd(e, () => { onPinToggle?.(list.id, !!isPinned); close(); })}>
                    <ListItemIcon>{isPinned ? <PushPinOutlined fontSize="small" /> : <PushPin fontSize="small" />}</ListItemIcon>
                    <ListItemText primary={t(isPinned ? 'lists.menu.unpin' : 'lists.menu.pin')} />
                </MenuItem>
                {list.isOwner ? (
                    <MenuItem onClick={(e: MouseEvent) => stopAnd(e, () => { onDelete?.(list.id); close(); })} sx={{ color: 'error.main' }}>
                        <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
                        <ListItemText primary={t('lists.menu.delete')} sx={{ color: 'inherit' }} />
                    </MenuItem>
                ) : null}
            </Menu>
        </>
    )
}
