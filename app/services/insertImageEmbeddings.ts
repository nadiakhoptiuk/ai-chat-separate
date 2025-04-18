import { addVector } from "~/qdrant/addVector"

import { generateImageEmbedding } from "./generateImageEmbeddings"

export const insertImageEmbeddings = async () => {
  const embeddings = await generateImageEmbedding('https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');

  const metadata = {
    filename: 'dogs.png',
    source: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    type: 'image',
    description: 'A photo of dogs',
  };

  await addVector("test", [embeddings], [metadata])
}

insertImageEmbeddings()