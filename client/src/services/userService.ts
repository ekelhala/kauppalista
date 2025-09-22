import api from "./api";

type UserSearchResult = {
    id: string;
    username: string;
}

export const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
    const response = await api.get<UserSearchResult[]>('/users', { params: { q: query } });
    return response.data;
}