import { Avatar, Menu, UnstyledButton, Group, ActionIcon } from "@mantine/core";
import { useAuth } from 'react-oidc-context';
import { IconLogout, IconCopy, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

export const AccountMenu = () => {
    const auth = useAuth();

    const displayNameRaw = auth.user?.profile?.name || auth.user?.profile?.given_name || '';
    const usernameRaw = auth.user?.profile?.preferred_username || auth.user?.profile?.username || auth.user?.profile?.email || '';
    const displayName = String(displayNameRaw);
    const username = String(usernameRaw);
    const initial = (displayName || username) ? (displayName || username).charAt(0).toUpperCase() : '?';

    return (
        <Menu withinPortal withArrow position="bottom">
            <Menu.Target>
                <UnstyledButton style={{ borderRadius: 9999 }} aria-label="Avaa käyttäjävalikko">
                    <Group>
                        <Avatar radius="xl">{initial}</Avatar>
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <div style={{ padding: '8px 12px', minWidth: 200 }}>
                    <div style={{ fontWeight: 700 }}>{(displayName || username) || 'Tuntematon käyttäjä'}</div>
                    {username ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, color: '#666', fontSize: 12 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{username}</div>
                            <div>
                                {/* Copy username */}
                                <CopyUsername username={username} />
                            </div>
                        </div>
                    ) : null}
                </div>
                <Menu.Divider />
                <Menu.Item onClick={async () => {
                    try {
                        await auth.signoutRedirect();
                    } catch {
                            try { await auth.removeUser(); } catch (e) { console.error('Logout failed', e); }
                        }
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <IconLogout size={16} />
                        Kirjaudu ulos
                    </div>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

const CopyUsername = ({ username }: { username: string }) => {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(username);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Copy failed', err);
        }
    }
    return (
        <ActionIcon size="sm" onClick={copy} aria-label="Kopioi käyttäjätunnus">
            {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
        </ActionIcon>
    )
}
