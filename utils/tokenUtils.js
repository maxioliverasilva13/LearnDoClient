
const DEFAULT_TOKEN_KEY_STORAGE = "learnDoToken";

export const storageToken = (token) => {
    localStorage.setItem(DEFAULT_TOKEN_KEY_STORAGE, token)
}

export const getToken = () => localStorage.getItem(DEFAULT_TOKEN_KEY_STORAGE);