import api from "../src/api";

export const rewriteContent = (data) => {
    return api.post("/v1/content/rewrite", data);
}

export const getContentHistory = () => {
    return api.get("/v1/content/history");
}

// 🛠️ FIX: Accept 'id' and add it to the URL
export const deleteContentHistory = (id) => {
    return api.delete(`/v1/content/history/${id}`);
}