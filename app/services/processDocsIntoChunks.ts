import { MDocument } from '@mastra/rag';

export const processTextIntoChunks = async (text: string) => {
  const doc = MDocument.fromText(text)

  // 2. Create chunks
  const chunks = await doc.chunk({
    strategy: "recursive",
    size: 512,
    overlap: 50,
  });
 
  return chunks;
}
