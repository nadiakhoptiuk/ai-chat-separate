import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

export const generateEmbeddings = async (chunks) => {
  const { embeddings } = await embedMany({
    values: chunks.map(chunk => chunk.text),
    model: openai.embedding("text-embedding-3-small"),
  });

return embeddings;
}