import { HfInference } from '@huggingface/inference'
import { pipeline } from '@huggingface/transformers';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './.env.development' });

const validateToken = () => {
  const token = process.env.HUGGINGFACE_API;


  if (!token) {
    throw new Error('HUGGINGFACE_API token is not set in environment variables');
  }
  return token;
};

// GENERATE EMBEDDING FOR IMAGE DESCRIPTION
export const generateEmbedding = async (imagePath: string) => {
  // const API_URL = 'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32';
  const token = validateToken();
  const client = new HfInference(token);

  const imageBuffer = fs.readFileSync(imagePath);

  const result = await client.imageToText({
    provider: "hf-inference",
    data: imageBuffer,
    model: 'Salesforce/blip-image-captioning-large',
  });

  console.log('Embedding vector:', result);
}

// await generateEmbedding('public/images/interior/#Limited #Minimalist #Designgames #Write #Living -1744806813107.jpg');


// GENERATE EMBEDDING DIRECTLY FOR IMAGE FROM URL
export const generateImageEmbedding = async (url = 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png'): Promise<number[]> => {
  const image_feature_extractor = await pipeline('image-feature-extraction', 'Xenova/vit-base-patch16-224-in21k', { dtype: 'fp32' });
  
  // FROM URL
  const features = await image_feature_extractor(url);

  const vectorArray = features.ort_tensor.data as Float32Array;

  const clsToken = Array.from(vectorArray.slice(0, 768));

  console.log('Embedding vector:', clsToken);

  return clsToken;
}

// await generateImageEmbedding()