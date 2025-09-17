import axios from "axios";

const BASE_URL = process.env.REACT_APP_STORAGE_API_URL || "http://localhost:8082";
const API_KEY = process.env.REACT_APP_STORAGE_API_KEY;
const JWT = process.env.REACT_APP_STORAGE_JWT;
const userLocale = navigator.language || navigator.userLanguage;

const headers = {
  "x-api-key": API_KEY,
  "Authorization": `Bearer ${JWT}`,
  "Accept-Language": userLocale
};

// --- Session Management ---
export const getSessions = async (page = 0, size = 20) =>
  axios.get(`${BASE_URL}/api/v1/sessions`, {
    headers,
    params: { page, size }
  }).then(res => res.data);

export const createSession = async (title) =>
  axios.post(`${BASE_URL}/api/v1/sessions`, { title }, { headers })
    .then(res => res.data);

export const deleteSession = async (sessionId) =>
  axios.delete(`${BASE_URL}/api/v1/sessions/${sessionId}`, { headers })
    .then(res => res.data);

export const toggleFavorite = async (sessionId) =>
  axios.put(`${BASE_URL}/api/v1/sessions/${sessionId}/favorite`, {}, { headers })
    .then(res => res.data);

// --- RENAME SESSION (PATCH) ---
// Use axios, include all headers!
export const renameSession = async (sessionId, newTitle) =>
  axios.patch(
    `${BASE_URL}/api/v1/sessions/${sessionId}`,
    { title: newTitle },
    { headers }
  ).then(res => res.data);

// --- Messages ---
export const getSessionMessages = (sessionId) =>
  axios.get(`${BASE_URL}/api/v1/sessions/${sessionId}/messages`, { headers })
    .then(res => res.data);

/**
 * Save messages to a session.
 * Each message must have a non-empty "role" and "content" property.
 * @param {string} sessionId
 * @param {Array<{role: string, content: string}>} messages
 */
export const saveMessageToSession = (sessionId, messages) => {
  // Validate messages before sending
  const validMessages = Array.isArray(messages)
    ? messages.filter(
        (msg) =>
          msg &&
          typeof msg.role === "string" &&
          msg.role.trim() &&
          typeof msg.content === "string" &&
          msg.content.trim()
      )
    : [];

  if (!validMessages.length) {
    return Promise.reject(
      new Error("Messages must be a non-empty array with role and content.")
    );
  }

  // POST the array, not an object
  return axios
    .post(
      `${BASE_URL}/api/v1/sessions/${sessionId}/messages`,
      validMessages,
      { headers }
    )
    .then((res) => res.data);
};

// --- Document Upload ---
export const uploadDocument = (sessionId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Merge auth headers with multipart content type
  const uploadHeaders = {
    ...headers,
    "Content-Type": "multipart/form-data"
  };

  return axios
    .post(`${BASE_URL}/api/v1/sessions/${sessionId}/documents`, formData, {
      headers: uploadHeaders
    })
    .then((res) => res.data);
};