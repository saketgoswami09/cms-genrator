import api from "../src/api";

export const rewriteContent = (data) => {
    return api.post("/v1/content/rewrite",data);
}