import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVector } from '@mastra/qdrant'

let qdrantClientInstance;

export const qdrantClient = (() => {
  if (!qdrantClientInstance) {
    qdrantClientInstance = new QdrantClient({
      host: "localhost",
      port: 6333,
    });
  }
  return qdrantClientInstance;
})();


let qdrantVectorInstance;

export const qdrantVectorStore = (() => {
  if (!qdrantVectorInstance) {
    qdrantVectorInstance = new QdrantVector(
      process.env.QDRANT_URL || "http://localhost:6333",
      process.env.QDRANT_API_KEY || ""
    );
  }
  return qdrantVectorInstance;
})();