import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert, Delete as TrashIcon } from '@mui/icons-material';
import { useState } from 'react';

export type ListOptionsMenuProps = {
    onClearSelected: () => void;
}

export const ListOptionsMenu = ({ onClearSelected }: ListOptionsMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-label="more options"
                aria-controls={open ? 'list-options-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ ml: 1 }}
            >
                <MoreVert />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="list-options-menu"
                open={open}
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => { setAnchorEl(null); onClearSelected(); }} color="error">
                    <ListItemIcon>
                        <TrashIcon />
                    </ListItemIcon>
                    <ListItemText primary="Tyhjennä valitut" />
                </MenuItem>
            </Menu>
        </>
    )
}
