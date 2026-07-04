import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreHoriz, Delete, PushPin, PushPinOutlined, Share } from '@mui/icons-material';
import type { MouseEvent } from 'react';
import type { List } from '../../types/List';
import { useState } from 'react';

type Props = {
    list: List;
    onShare?: (id: string) => void;
    onDelete?: (id: string) => void;
    onPinToggle?: (id: string, currentlyPinned: boolean) => void;
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                onClick={(e: MouseEvent) => stopAnd(e, () => setAnchorEl(e.currentTarget as HTMLElement))}
                aria-label="Avaa valikko"
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
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {list.isOwner ? (
                    <MenuItem onClick={(e: MouseEvent) => stopAnd(e, () => { onShare?.(list.id); setAnchorEl(null); })}>
                        <ListItemIcon><Share fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Jaa" />
                    </MenuItem>
                ) : null}
                <MenuItem onClick={(e: MouseEvent) => stopAnd(e, () => { onPinToggle?.(list.id, !!isPinned); setAnchorEl(null); })}>
                    <ListItemIcon>{isPinned ? <PushPinOutlined fontSize="small" /> : <PushPin fontSize="small" />}</ListItemIcon>
                    <ListItemText primary={isPinned ? 'Poista kiinnitys' : 'Kiinnitä'} />
                </MenuItem>
                {list.isOwner ? (
                    <MenuItem onClick={(e: MouseEvent) => stopAnd(e, () => { onDelete?.(list.id); setAnchorEl(null); })} sx={{ color: 'error.main' }}>
                        <ListItemIcon><Delete fontSize="small" /></ListItemIcon>
                        <ListItemText primary="Poista" sx={{ color: 'inherit' }} />
                    </MenuItem>
                ) : null}
            </Menu>
        </>
    )
}
