const DEFAULT_API_BASE_URL = "https://tfolio-backend.onrender.com/api";

export const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");
