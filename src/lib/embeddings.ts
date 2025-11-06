import { EmbeddingVector, getHuggingFaceEmbedding } from './huggingFace';

const DEFAULT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

export async function embedText(text: string, model = DEFAULT_MODEL): Promise<EmbeddingVector> {
  const apiKey = import.meta.env.VITE_HF_API_KEY;
  return getHuggingFaceEmbedding(text, model, apiKey);
}

export async function embedBatch(texts: string[], model = DEFAULT_MODEL): Promise<EmbeddingVector[]> {
  return Promise.all(texts.map(text => embedText(text, model)));
}
