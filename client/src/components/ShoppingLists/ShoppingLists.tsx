import type { List } from "../../types/List";
import ShoppingListItem from "../ShoppingListItem";

interface ShoppingListsProps {
    lists: List[];
    onListSelect: (listId: string) => void;
    onListDelete: (listId: string) => void;
    onListShare: (listId: string) => void;
    isListPinned: (listId: string) => boolean;
    onListTogglePinned: (listId: string) => void;
    isListOwner: (listId: string) => boolean;
}

export const ShoppingLists = ({ lists, 
                                onListSelect,
                                onListDelete,
                                onListShare,
                                isListPinned,
                                onListTogglePinned,
                                isListOwner }: ShoppingListsProps) => {
    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {lists.map(list => (
            <ShoppingListItem
                list={list}
                onClick={(id) => onListSelect(id)}
                onDelete={(id) => onListDelete(id)}
                onShare={(id) => onListShare(id)}
                isPinned={isListPinned(list.id)}
                onPinToggle={(id) => onListTogglePinned(id)}
                isOwner={isListOwner(list.id)}
            />
        ))}
    </div>
    )
}