import { useState } from "react";
import { TextInput, Button, Modal, Group } from "@mantine/core";

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
    <Modal opened={opened} onClose={handleClose} title="Lisää tuote">
        <TextInput
            value={itemName}
            onChange={(e) => setItemName(e.currentTarget.value)}
            placeholder="Tuotteen nimi"
        />
        <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose}>Peruuta</Button>
            <Button onClick={handleAddItem} disabled={!itemName.trim()}>
                Lisää
            </Button>
        </Group>
    </Modal>
  )
}