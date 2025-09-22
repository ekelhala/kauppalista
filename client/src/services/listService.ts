
import type { List } from "../types/List";
import type { Item } from "../types/Item";
import api from "./api";

type GetListItemsResponse = {
    items: Item[]
}

type CreateListResponse = {
    id: string;
}

type AddItemResponse = {
    id: string;
}

export const getLists = async (): Promise<List[]> => {
    const listData = (await api.get<List[]>('/lists')).data
    await Promise.all(listData.map(async list => {
        list.items = (await getItems(list.id)).items;
    }));
    return listData;
}
export const createList = async (name: string): Promise<CreateListResponse> => (await api.post<CreateListResponse>('/lists', { name })).data
export const deleteList = async (id: string): Promise<void> => (await api.delete<void>(`/lists/${id}`)).data
export const getItems = async (listId: string): Promise<GetListItemsResponse> => (await api.get<GetListItemsResponse>(`/lists/${listId}`)).data
export const addItem = async (listId: string, name: string): Promise<AddItemResponse> => (await api.post<AddItemResponse>(`/lists/${listId}`, { name })).data
export const checkItem = async (itemId: string, checked: boolean): Promise<void> => (await api.post<void>(`/items/${itemId}/toggle`, { checked })).data
export const deleteItem = async (itemId: string): Promise<void> => (await api.delete<void>(`/items/${itemId}`)).data
export const shareList = async (listId: string, toUser: string): Promise<void> => (await api.post<void>(`/lists/${listId}/share`, { to_user: toUser })).data
export const getSharedWithMeLists = async (): Promise<List[]> => {
    const listData = (await api.get<List[]>('/lists/shared')).data
    await Promise.all(listData.map(async list => {
        list.items = (await getItems(list.id)).items;
    }));
    return listData;
}
export const pinList = async (listId: string): Promise<void> => (await api.post<void>(`/lists/${listId}/pin`)).data
export const unpinList = async (listId: string): Promise<void> => (await api.post<void>(`/lists/${listId}/unpin`)).data
export const getPinnedLists = async (): Promise<List[]> => {
    const listData = (await api.get<List[]>('/lists/pinned')).data
    await Promise.all(listData.map(async list => {
        list.items = (await getItems(list.id)).items;
    }));
    return listData;
}