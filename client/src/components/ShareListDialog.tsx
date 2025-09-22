import { Modal, Button, TextInput, Box, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { searchUsers } from "../services/userService";
import { shareList } from "../services/listService";

export type ShareListDialogProps = {
    opened: boolean;
    onClose: () => void;
    listId: string | null;
    onShared: () => void;
}

export const ShareListDialog = ({ opened, onClose, listId, onShared }: ShareListDialogProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ id: string; username: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setResults([]);
        setSelectedUser(null);
        setQuery('');
    }, [opened]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        let cancelled = false;
        setLoading(true);
        (async () => {
            try {
                const users = await searchUsers(query.trim());
                if (!cancelled) setResults(users);
            } catch (err) {
                console.error('Error searching users', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [query]);

    const handleShare = async () => {
        if (!listId || !selectedUser) return;
        try {
            await shareList(listId, selectedUser);
            onShared();
            onClose();
        } catch (err) {
            console.error('Error sharing list', err);
        }
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Jaa lista">
            <Box>
                <Text mb="xs">Etsi käyttäjää käyttäjätunnuksella</Text>
                <TextInput
                    placeholder="Hae käyttäjää"
                    value={query}
                    onChange={(e) => setQuery(e.currentTarget.value)}
                    mb="sm"
                />

                <div style={{ maxHeight: 200, overflow: 'auto', marginBottom: 12 }}>
                    {results.length === 0 ? (
                        <Text c="dimmed">Ei hakutuloksia</Text>
                    ) : (
                        results.map(u => (
                            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8 }}>
                                <div>{u.username}</div>
                                <Button size="xs" variant={selectedUser === u.id ? 'filled' : 'outline'} onClick={() => setSelectedUser(u.id)}>
                                    {selectedUser === u.id ? 'Valittu' : 'Valitse'}
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button variant="default" onClick={onClose}>Peruuta</Button>
                    <Button onClick={handleShare} disabled={!selectedUser || !listId} loading={loading}>Jaa</Button>
                </div>
            </Box>
        </Modal>
    )
}
