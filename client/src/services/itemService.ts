import axios from "axios";

import { PROD_API_URL, DEV_API_URL } from "../constants";

const BASE_URL = import.meta.env.DEV ? DEV_API_URL : PROD_API_URL;

export const increaseItemQuantity = async (itemId: string): Promise<void> => {
    await axios.post<void>(`${BASE_URL}/items/${itemId}/increase`);
}

export const decreaseItemQuantity = async (itemId: string): Promise<void> => {
    await axios.post<void>(`${BASE_URL}/items/${itemId}/decrease`);
}