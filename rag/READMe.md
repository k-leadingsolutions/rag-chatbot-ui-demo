# RAG Backend (Node.js + Express + Ollama)

This is a free, local Retrieval-Augmented Generation (RAG) backend using Node.js, Express, and [Ollama](https://ollama.com/) (for local LLMs/embeddings). It is designed to integrate with:
- A React frontend (`/query` and `/embedding`)
- A standalone Spring Boot backend (for session, message, and document storage)

## Endpoints

- `POST /query`  
  `{ query: "question", sessionId: "..." }`  
  Returns: `{ answers: [{ answer: "..." }] }`
    - Fetches docs from Spring Boot backend, retrieves relevant context, calls Ollama LLM for answer

- `POST /embedding`  
  `{ text: "..." }`  
  Returns: `{ embedding: [...] }`
    - Returns embedding vector from Ollama model

## Prerequisites

- [Ollama](https://ollama.com/) installed and running (`ollama serve`)
- Pull models:
    - `ollama pull mistral`
    - `ollama pull nomic-embed-text`

- Spring Boot storage backend running and accessible (default: http://localhost:8080)

## Getting Started

1. Install dependencies:
   ```bash
   cd rag-backend
   npm install
   ```
2. Configure `.env` if needed (see provided example).
3. Start server:
   ```bash
   npm start
   ```
4. The backend will be available at `http://localhost:8000`.

## Customization

- Change models in `.env`:
    - `EMBEDDING_MODEL=nomic-embed-text`
    - `LLM_MODEL=mistral`
- Adjust document fetching to match your Spring Boot API's contract.

## Production Notes

- This example fetches and embeds docs on every query (for demo). For production, precompute and cache doc embeddings.
- Add authentication, error handling, and rate limiting as needed.
