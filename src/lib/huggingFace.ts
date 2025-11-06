const HF_EMBEDDINGS_URL = 'https://api-inference.huggingface.co/embeddings';

export type EmbeddingVector = number[];

export interface EmbeddingResponse {
  embedding: EmbeddingVector;
}

export class HuggingFaceError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'HuggingFaceError';
    this.status = status;
  }
}

export async function getHuggingFaceEmbedding(
  text: string,
  model: string,
  apiKey: string
): Promise<EmbeddingVector> {
  if (!apiKey) {
    throw new HuggingFaceError('Missing Hugging Face API key');
  }

  const response = await fetch(`${HF_EMBEDDINGS_URL}/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new HuggingFaceError(
      `Hugging Face request failed with status ${response.status}: ${errorText}`,
      response.status
    );
  }

  const data = (await response.json()) as EmbeddingResponse;

  if (!data || !Array.isArray(data.embedding)) {
    throw new HuggingFaceError('Invalid embedding response from Hugging Face');
  }

  return data.embedding;
}

export function cosineSimilarity(a: EmbeddingVector, b: EmbeddingVector): number {
  if (a.length !== b.length) {
    throw new Error('Embedding vectors must be of the same length');
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
