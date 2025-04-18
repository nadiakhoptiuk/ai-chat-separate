import { qdrantVectorStore } from "~/lib/qdrant";
import { generateImageEmbedding } from "./generateImageEmbeddings";
import { generateTextEmbedding } from "./generateTextEmbeddings";

const searchByEmbedding = async (collectionName: string, embedding: number[]) => {
  const results = await qdrantVectorStore.query({
    indexName: collectionName,
    queryVector: embedding,
    topK: 1,
  });

  console.log('results >>>>>', results);

  return results;
}

const queryEmbeddingFromImage = async (url: string) => {
  return await generateImageEmbedding(url);
}

const queryEmbeddingFromText = async (text: string) => {
  return await generateTextEmbedding(text);
}


// TEST QUERY EMBEDDING FROM IMAGE
// searchByEmbedding('test', await queryEmbeddingFromImage('https://images.pexels.com/photos/19464920/pexels-photo-19464920/free-photo-of-labrador-retriever-puppy-lying-down.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'))


// TEST QUERY EMBEDDING FROM TEXT
searchByEmbedding('test', await queryEmbeddingFromText('A photo of a labrador retriever puppy lying down'))