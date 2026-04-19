import api from "@/api";
import { API } from "./endpoints";

export const generateImage = (data) => api.post(API.IMAGE.GENERATE, data);
export const imageHistory = () => api.get(API.IMAGE.HISTORY);
