import api from "../src/api";

export const generateImage = (data) => {
    return api.post("/v1/image/generate",data);
}