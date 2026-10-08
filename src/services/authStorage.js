const TOKEN_KEY = "token";

const authStorage = {
    getToken() {
        return (
            localStorage.getItem(TOKEN_KEY) ||
            sessionStorage.getItem(TOKEN_KEY)
        );
    },

    setToken(token, remember = true) {
        const store = remember ? localStorage : sessionStorage;
        store.setItem(TOKEN_KEY, token);
    },

    clear() {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("username");
        localStorage.removeItem("profilePhotoUrl");
    },
};

export default authStorage;