require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const SPRING_STORAGE_API = process.env.SPRING_STORAGE_API || 'http://localhost:8080';
const OLLAMA_API = process.env.OLLAMA_API || 'http://localhost:11434';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'nomic-embed-text';
const LLM_MODEL = process.env.LLM_MODEL || 'mistral';

// Helper: fetch documents for a session from Spring Boot storage backend
async function fetchDocsForSession(sessionId) {
  try {
    const resp = await axios.get(`${SPRING_STORAGE_API}/api/v1/sessions/${sessionId}/documents`);
    // Expecting [{ id, text/content, ... }]
    return resp.data && Array.isArray(resp.data) ? resp.data : (resp.data.data || []);
  } catch (e) {
    console.error('Error fetching docs from storage:', e.message);
    return [];
  }
}

// Helper: get embedding from Ollama
async function getEmbedding(text) {
  try {
    const resp = await axios.post(`${OLLAMA_API}/api/embeddings`, {
      model: EMBEDDING_MODEL,
      prompt: text
    });
    return resp.data.embedding;
  } catch (e) {
    console.error('Error from Ollama embedding:', e.message);
    return null;
  }
}

// Helper: compute cosine similarity
function cosineSim(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (normA * normB);
}

// Helper: call Ollama LLM for completion
async function generateAnswer(context, question) {
  const prompt = `Context:\n${context}\n\nQuestion: ${question}\nAnswer:`;
  const resp = await axios.post(`${OLLAMA_API}/api/generate`, {
    model: LLM_MODEL,
    prompt,
    stream: false
  });
  return resp.data.response;
}

// POST /embedding
app.post('/embedding', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });
  const embedding = await getEmbedding(text);
  if (!embedding) return res.status(500).json({ error: 'Embedding failed' });
  res.json({ embedding });
});

// POST /query
app.post('/query', async (req, res) => {
  const { query, filters, sessionId } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  // Step 1: Fetch docs from storage backend
  let docs = [];
  if (sessionId) {
    docs = await fetchDocsForSession(sessionId);
  }

  // If no docs, fallback to demo doc
  if (!docs.length) {
    docs = [
      { id: 'demo', text: 'This is a demo context document. Add documents to your session!' }
    ];
  }

  // Step 2: Get query embedding
  const queryEmbedding = await getEmbedding(query);
  if (!queryEmbedding) return res.status(500).json({ error: 'Failed to get query embedding' });

  // Step 3: Get doc embeddings and rank by similarity
  const docEmbeddings = await Promise.all(
    docs.map(async doc => {
      const docText = doc.text || doc.content || '';
      const emb = await getEmbedding(docText);
      return emb;
    })
  );

  // Step 4: Find most relevant doc(s)
  let bestIdx = 0, bestScore = -1;
  docEmbeddings.forEach((emb, i) => {
    if (!emb) return;
    const score = cosineSim(queryEmbedding, emb);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  });

  const topDoc = docs[bestIdx];
  const context = topDoc ? (topDoc.text || topDoc.content || '') : '';

  // Step 5: Generate answer using LLM
  let answer;
  try {
    answer = await generateAnswer(context, query);
  } catch (e) {
    console.error('LLM error:', e.message);
    answer = 'Failed to generate answer from LLM.';
  }

  res.json({ answers: [{ answer }] });
});

// Health check
app.get('/', (req, res) => {
  res.send('RAG Backend is running.');
});

app.listen(PORT, () => {
  console.log(`RAG backend listening on port ${PORT}`);
});