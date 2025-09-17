# RAG Chat Demo UI

A polished, Material-UI powered React frontend for chatting with a Retrieval-Augmented Generation (RAG) bot and managing chat history using your storage microservice.

---

## Features

- Create, rename, delete chat sessions
- Mark/unmark sessions as favorite
- Paginated session and chat history
- Responsive, modern layout (Material-UI)
- Chat with Ollam RAG backend
- Stores all messages and sessions in your storage microservice

---

## Setup

1. **Clone this repo and enter the directory.**

2. **Copy `.env.example` to `.env` and fill in your endpoints and credentials:**
   ```
   cp .env.example .env
   # Edit .env with your API endpoints and keys
   ```

3. **Install dependencies:**
   ```
   npm install
   ```

4. **Run the app:**
   ```
   npm start
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Configuration

- `REACT_APP_STORAGE_API_URL`: Your rag storage microservice base URL
- `REACT_APP_STORAGE_API_KEY`: API key for storage microservice
- `REACT_APP_STORAGE_JWT`: JWT for storage microservice
- `REACT_APP_RAG_API_URL`: NodeJS API URL

---

## API Flow

- All session and chat history management is handled via your storage microservice (see Swagger).
- User messages are sent to Haystack RAG, and the assistant's response is stored back in storage.

---

## Customization

- The UI uses Material-UI for styling. You can easily adjust colors, fonts, and layout in `src/theme.js`.
- Add more features or polish as you like!

---

## Bonus Points

- Full pagination on session and message lists
- Centralized error handling and loading states
- Modern, accessible, mobile-responsive design

---

## License

MIT
