import axios from "axios";

import type { List } from "../types/List";
import { PROD_API_URL, DEV_API_URL } from "../constants";
import type { Item } from "../types/Item";

const BASE_URL = import.meta.env.DEV ? DEV_API_URL : PROD_API_URL;

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
    const listData = (await axios.get<List[]>(`${BASE_URL}/lists`)).data
    await Promise.all(listData.map(async list => {
        list.items = (await getItems(list.id)).items;
    }));
    return listData;
}
export const createList = async (name: string): Promise<CreateListResponse> => (await axios.post<CreateListResponse>(`${BASE_URL}/lists`, { name })).data
export const deleteList = async (id: string): Promise<void> => (await axios.delete<void>(`${BASE_URL}/lists/${id}`)).data
export const getItems = async (listId: string): Promise<GetListItemsResponse> => (await axios.get<GetListItemsResponse>(`${BASE_URL}/lists/${listId}`)).data
export const addItem = async (listId: string, name: string): Promise<AddItemResponse> => (await axios.post<AddItemResponse>(`${BASE_URL}/lists/${listId}`, { name })).data
export const checkItem = async (itemId: string, checked: boolean): Promise<void> => (await axios.post<void>(`${BASE_URL}/items/${itemId}/toggle`, { checked })).data
export const deleteItem = async (itemId: string): Promise<void> => (await axios.delete<void>(`${BASE_URL}/items/${itemId}`)).data