
import api from "./api";

export const increaseItemQuantity = async (itemId: string): Promise<void> => {
    await api.post<void>(`/items/${itemId}/increase`);
}

export const decreaseItemQuantity = async (itemId: string): Promise<void> => {
    await api.post<void>(`/items/${itemId}/decrease`);
}