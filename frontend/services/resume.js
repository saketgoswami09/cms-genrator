// src/services/resume.service.js
import api from "../src/api";

export const analyzeResume = (formData) => {
  return api.post("/v1/resume/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};