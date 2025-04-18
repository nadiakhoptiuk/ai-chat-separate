import { qdrantVectorStore } from "~/lib/qdrant";

export const addVector = async (collectionName: string, embeddings: number[][], metadata: Record<string, string>[]) => {

  await qdrantVectorStore.upsert({
    indexName: collectionName,
    vectors: embeddings,
    metadata: metadata,
  });

};
