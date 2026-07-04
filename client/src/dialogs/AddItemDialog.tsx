import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export type AddItemDialogProps = {
    opened: boolean;
    onClose: () => void;
    onItemAdded: (name: string) => void;
}

export const AddItemDialog = ({ opened, onClose, onItemAdded }: AddItemDialogProps) => {

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
            <DialogTitle>Lisää tuote</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    autoFocus
                    value={itemName}
                    onChange={(e) => setItemName(e.currentTarget.value)}
                    placeholder="Tuotteen nimi"
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>Peruuta</Button>
                <Button onClick={handleAddItem} disabled={!itemName.trim()}>
                    Lisää
                </Button>
            </DialogActions>
        </Dialog>
    )
}
