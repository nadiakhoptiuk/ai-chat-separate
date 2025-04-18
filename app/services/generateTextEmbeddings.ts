import { pipeline } from "@huggingface/transformers";
import { meanPooling } from "./meanPooling";

// This model doesn't work
export const generateTextEmbedding = async (text: string) => {
  const extractor = await pipeline('feature-extraction', 'onnxport/distilbert-base-uncased-onnx', { dtype: 'fp32' });
  
  const { ort_tensor: { data, dims } } = await extractor(text);

  const avgResult = meanPooling(data, dims[1], dims[2]);

  console.log('avgResult:', avgResult);

  return avgResult;
}

generateTextEmbedding('A photo of a labrador')