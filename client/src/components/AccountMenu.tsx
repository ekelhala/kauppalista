import { Avatar, IconButton, Menu, MenuItem, Divider, ListSubheader, Box, Typography } from "@mui/material";
import { useAuth } from 'react-oidc-context';
import { Logout, ContentCopy, Check, DarkMode, LightMode } from '@mui/icons-material';
import { useState } from 'react';
import type { Theme } from "../types/Theme";

export interface AccountMenuProps {
    onThemeToggle: () => void;
    mode: Theme;
}

export const AccountMenu = ({ onThemeToggle, mode }: AccountMenuProps) => {
    const auth = useAuth();
    const displayNameRaw = auth.user?.profile?.name || auth.user?.profile?.given_name || '';
    const usernameRaw = auth.user?.profile?.preferred_username || auth.user?.profile?.username || auth.user?.profile?.email || '';
    const displayName = String(displayNameRaw);
    const username = String(usernameRaw);
    const initial = (displayName || username) ? (displayName || username).charAt(0).toUpperCase() : '?';

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-label="Avaa käyttäjävalikko"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ borderRadius: 9999 }}
            >
                <Avatar sx={{ width: 32, height: 32 }}>{initial}</Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={() => setAnchorEl(null)}
                onClick={() => setAnchorEl(null)}
                slotProps={{
                    paper: {
                        sx: { width: 200 }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ padding: '8px 12px', minWidth: 200 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{(displayName || username) || 'Tuntematon käyttäjä'}</Typography>
                    {username ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, color: 'text.secondary', fontSize: 12 }}>
                            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{username}</Box>
                            <CopyUsername username={username} />
                        </Box>
                    ) : null}
                </Box>
                <Divider />
                <ListSubheader>Asetukset</ListSubheader>
                <MenuItem onClick={() => { setAnchorEl(null); onThemeToggle(); }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {mode === 'dark' ? (
                            <><LightMode fontSize="small" />Vaalea tila</>
                        ) : (
                            <><DarkMode fontSize="small" />Tumma tila</>
                        )}
                    </Box>
                </MenuItem>
                <Divider />
                <ListSubheader>Käyttäjätoiminnot</ListSubheader>
                <MenuItem onClick={async () => {
                    setAnchorEl(null);
                    try { await auth.signoutRedirect(); }
                    catch { try { await auth.removeUser(); } catch (e) { console.error('Logout failed', e); } }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Logout fontSize="small" />Kirjaudu ulos
                    </Box>
                </MenuItem>
            </Menu>
        </>
    )
}

const CopyUsername = ({ username }: { username: string }) => {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try { await navigator.clipboard.writeText(username); setCopied(true); setTimeout(() => setCopied(false), 1500); }
        catch (err) { console.error('Copy failed', err); }
    }
    return (
        <IconButton size="small" onClick={copy} aria-label="Kopioi käyttäjätunnus">
            {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
        </IconButton>
    )
}
