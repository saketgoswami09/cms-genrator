import api from "@/api";
import { API } from "./endpoints";

export const rewriteContent = (data) => api.post(API.CONTENT.REWRITE, data);
export const expandContent = (data) => api.post(API.CONTENT.EXPAND, data);
export const shortenContent = (data) => api.post(API.CONTENT.SHORTEN, data);
export const generateArticle = (data) => api.post(API.CONTENT.ARTICLE, data);
export const generateSeoContent = (data) => api.post(API.CONTENT.SEO, data);

export const getContentHistory = () => api.get(API.CONTENT.HISTORY);
export const deleteContentHistory = (id) => api.delete(`${API.CONTENT.HISTORY}/${id}`);
