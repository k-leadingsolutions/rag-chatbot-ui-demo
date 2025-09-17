import axios from "axios";

const BASE_URL = process.env.REACT_APP_RAG_API_URL || "http://localhost:8000";
const userLocale = navigator.language || navigator.userLanguage;

/**
 * Query the Haystack RAG backend for an answer.
 * @param {string} question - The user input/question.
 * @param {object} filters - Optional filters for document retrieval.
 * @returns {Promise<string>} - The answer from Haystack.
 */
export const queryRAG = async (question, filters = null) => {
  try {
    const response = await axios.post(`${BASE_URL}/query`, {
      query: question,
      filters,
    });
    // Haystack returns an array of answers
    return response.data.answers?.[0]?.answer || "No answer found.";
  } catch (error) {
    console.error("Error querying Haystack:", error);
    return "Error connecting to RAG backend.";
  }
};

/**
 * Get embedding for a text from the Haystack embedding endpoint.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const getEmbedding = async (text) => {
  try {
    const response = await axios.post(`${BASE_URL}/embedding`, { text });
    return response.data.embedding;
  } catch (error) {
    console.error("Error fetching embedding:", error);
    return null;
  }
};

/**
 * Upload a document to Haystack RAG context manager for a session.
 * @param {string} sessionId - The session identifier.
 * @param {File} file - The file to upload.
 * @returns {Promise<any>} - The response data from Haystack.
 */
export const uploadDocumentToRAG = async (sessionId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Set headers for multipart/form-data and locale
  const uploadHeaders = {
    "Content-Type": "multipart/form-data",
    "Accept-Language": userLocale,
  };


  const url = `${BASE_URL}/api/v1/sessions/${sessionId}/documents`;

  try {
    const response = await axios.post(url, formData, { headers: uploadHeaders });
    return response.data;
  } catch (error) {
    console.error("Error uploading document to RAG:", error);
    throw error;
  }
};