import api from "@/api";
import { API } from "./endpoints";

export const analyzeResume = (formData) => {
  return api.post(API.RESUME.ANALYZE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
