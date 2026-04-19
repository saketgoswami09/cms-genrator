import api from "@/api";
import { API } from "./endpoints";

export const signUp = (data) => api.post(API.AUTH.SIGN_UP, data);
export const signIn = (data) => api.post(API.AUTH.SIGN_IN, data);
