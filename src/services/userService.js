import API from "./api";

export const getCurrentUser = () =>
    API.get("http://localhost:8080/v1/users/me");