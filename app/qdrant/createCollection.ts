import { qdrantVectorStore } from "~/lib/qdrant";

const createCollection = async (collectionName: string) => {
  await qdrantVectorStore.createIndex({
    indexName: collectionName,
    dimension: 1536,
  });
};

createCollection("test");

