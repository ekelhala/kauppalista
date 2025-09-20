import { Button, Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import { createList } from "../services/shoppingListService";

export type AddListDialogProps = {
    opened: boolean;
    onClose: () => void;
    onListCreated: () => void;
}

export const AddListDialog = ({opened, onClose, onListCreated}: AddListDialogProps) => {

    const [newListName, setNewListName] = useState('');

    return (
        <Modal opened={opened} onClose={() => {setNewListName(''); onClose();}} title="Luo uusi lista">
            <TextInput
                placeholder="Listan nimi"
                value={newListName}
                onChange={(e) => setNewListName(e.currentTarget.value)}
                mb="md"
            />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="default" onClick={() => {setNewListName(''); onClose();}}>Peruuta</Button>
            <Button
            onClick={async () => {
                if (!newListName.trim()) return;
                try {
                await createList(newListName.trim());
                    setNewListName('');
                    onListCreated();
                    onClose();
                } catch (error) {
                    console.error("Error creating list:", error);
                }
            }}
            >Tallenna</Button>
        </div>
        </Modal>
    )
}