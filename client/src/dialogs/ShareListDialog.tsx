import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemSecondaryAction, ListItemText, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
        <Dialog open={opened} onClose={onClose}>
            <DialogTitle>{t('dialogs.shareList.title')}</DialogTitle>
            <DialogContent>
                <Typography variant="body2" sx={{ mb: 1 }}>{t('dialogs.shareList.searchPrompt')}</Typography>
                <TextField
                    fullWidth
                    placeholder={t('dialogs.shareList.searchPlaceholder')}
                    value={query}
                    onChange={(e) => {
                        if (e.currentTarget.value.trim() === '') {
                            setResults([]);
                            setSelectedUser(null);
                            setLoading(false);
                        }
                        setQuery(e.currentTarget.value)}}
                    sx={{ mb: 1 }}
                />

                <div style={{ maxHeight: 200, overflow: 'auto', marginBottom: 12 }}>
                    {results.length === 0 ? (
                        <Typography color="text.secondary">{t('dialogs.shareList.noResults')}</Typography>
                    ) : (
                        <List>
                            {results.map(u => (
                                <ListItem key={u.id} sx={{ paddingY: 0.5 }}>
                                    <ListItemText primary={u.username} />
                                    <ListItemSecondaryAction>
                                        <Button size="small" variant={selectedUser === u.id ? 'contained' : 'outlined'} onClick={() => setSelectedUser(u.id)}>
                                            {selectedUser === u.id ? t('dialogs.shareList.selected') : t('dialogs.shareList.select')}
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>{t('common.actions.cancel')}</Button>
                <Button onClick={handleShare} disabled={!selectedUser || !listId} startIcon={loading ? <CircularProgress size={16} /> : null} loading={loading}>{t('common.actions.share')}</Button>
            </DialogActions>
        </Dialog>
    )
}
