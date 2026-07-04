import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export type AddItemDialogProps = {
    opened: boolean;
    onClose: () => void;
    onItemAdded: (name: string) => void;
}

export const AddItemDialog = ({ opened, onClose, onItemAdded }: AddItemDialogProps) => {
    const { t } = useTranslation();

    const [itemName, setItemName] = useState('');

    const handleAddItem = () => {
        onItemAdded(itemName);
        setItemName('');
        onClose();
    }

    const handleClose = () => {
        setItemName('');
        onClose();
    }

    return (
        <Dialog open={opened} onClose={handleClose}>
            <DialogTitle>{t('dialogs.addItem.title')}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    autoFocus
                    value={itemName}
                    onChange={(e) => setItemName(e.currentTarget.value)}
                    placeholder={t('dialogs.addItem.namePlaceholder')}
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>{t('common.actions.cancel')}</Button>
                <Button onClick={handleAddItem} disabled={!itemName.trim()}>
                    {t('common.actions.add')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
