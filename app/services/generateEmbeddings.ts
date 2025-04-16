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

export const generateImageEmbedding = async () => {
 const image_feature_extractor = await pipeline('image-feature-extraction', 'Xenova/vit-base-patch16-224-in21k');
const url = 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png';
const features = await image_feature_extractor(url);

console.log('Embedding vector:', features);
}

await generateImageEmbedding()