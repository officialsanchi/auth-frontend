import API from "./api";

export const getCurrentUser = () =>
    API.get("/users/me");