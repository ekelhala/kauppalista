import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { createList } from "../services/listService";

export type AddListDialogProps = {
    opened: boolean;
    onClose: () => void;
    onListCreated: () => void;
}

export const AddListDialog = ({opened, onClose, onListCreated}: AddListDialogProps) => {

    const [newListName, setNewListName] = useState('');

    const handleCreate = async () => {
        if (!newListName.trim()) return;
        try {
            await createList(newListName.trim());
            setNewListName('');
            onListCreated();
            onClose();
        } catch (error) {
            console.error("Error creating list:", error);
        }
    }

    return (
        <Dialog open={opened} onClose={() => {setNewListName(''); onClose();}}>
            <DialogTitle>Luo uusi lista</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    autoFocus
                    placeholder="Listan nimi"
                    value={newListName}
                    onChange={(e) => setNewListName(e.currentTarget.value)}
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => {setNewListName(''); onClose();}}>Peruuta</Button>
                <Button onClick={handleCreate} disabled={!newListName.trim()}>Tallenna</Button>
            </DialogActions>
        </Dialog>
    )
}
