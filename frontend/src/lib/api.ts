import axios from "axios"
import { getCsrfToken } from "./csrf"

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "X-CSRF-Token": getCsrfToken(),
    "Accept": "application/json"
  },
  withCredentials: true
})
