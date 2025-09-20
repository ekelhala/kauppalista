import axios from "axios";

import type { List } from "../types/List";
import { PROD_API_URL, DEV_API_URL } from "../constants";
import type { Item } from "../types/Item";

const BASE_URL = import.meta.env.DEV ? DEV_API_URL : PROD_API_URL;

export const getLists = async (): Promise<List[]> => (await axios.get<List[]>(`${BASE_URL}/lists`)).data
export const createList = async (name: string): Promise<string> => (await axios.post<string>(`${BASE_URL}/lists`, { name })).data
export const deleteList = async (id: string): Promise<void> => (await axios.delete<void>(`${BASE_URL}/lists/${id}`)).data
export const getItems = async (listId: string): Promise<Item[]> => (await axios.get<Item[]>(`${BASE_URL}/lists/${listId}/items`)).data