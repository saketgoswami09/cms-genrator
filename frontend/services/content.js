import api from "../src/api";
import { REWRITE_URL } from "./endpoints";

export const rewriteContent = (data) => {
  return api.post(REWRITE_URL, data);
};

export const getContentHistory = () => {
  return api.get("/v1/content/history");
};

//  Accept 'id' and add it to the URL
export const deleteContentHistory = (id) => {
  return api.delete(`/v1/content/history/${id}`);
};

export const shortenContent = (data) => {
  return api.post(`/v1/content/shorten`, data);
};

export const generateArticle = (data) => {
  return api.post("/v1/content/article", data);
};

export const generateSeoContent = (data) => {
  return api.post("/v1/content/seo-content", data);
};

export const expandContent = (data) => {
  return api.post("/v1/content/expand", data);
};