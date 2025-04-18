import fs from 'fs';
// import { extractImagesFromURL } from './extractImagesFromURL';
import dotenv from 'dotenv';
import path from 'path';
import { pipeline } from '@huggingface/transformers';

dotenv.config({ path: './.env.development' });

const validateToken = () => {
  const token = process.env.HUGGINGFACE_API;

  if (!token) {
    throw new Error('HUGGINGFACE_API token is not set in environment variables');
  }
  return token;
};

// GENERATE DESCRIPTIONS FOR A SINGLE LOCAL IMAGE
export const generateDescription = async (imagePath: string) => {
  const API_URL = 'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning'

  try {
    const token = validateToken();
    const file = fs.readFileSync(imagePath);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: file,
    });

    if (response.status === 403) {
      throw new Error('API token is invalid or expired. Please check your HUGGINGFACE_API token.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      // console.log('Description generated:', imagePath, data);
      return data;
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response type: ${contentType}, Response: ${text}`);
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error generating description:', error.message);
      throw error;
    }
    throw new Error('Unknown error occurred while generating description');
  }
}


const saveDescriptionsToFile = async (descriptions: {fileName: string, description: string}[], fileName: string) => {
  const destinationPath = path.join(process.cwd(), 'public', 'data', `descriptions-${fileName}.json`);
  fs.writeFileSync(destinationPath, JSON.stringify(descriptions));
}

// GENERATE DESCRIPTIONS FOR ALL IMAGES IN A FOLDER
const generateAllImagesDescriptions = async (fileName: string) => {
  const publicFolderPath = path.join(process.cwd(), "public");
  const folderPath = path.join(publicFolderPath, 'images', fileName);
  const descriptions: {fileName: string, description: string}[] = [];

  const files = await fs.promises.readdir(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const description = await generateDescription(fullPath);
    descriptions.push({fileName: file, description: description[0].generated_text});
  } 

  console.log('descriptions', descriptions);

  saveDescriptionsToFile(descriptions, fileName);
}


// generateAllImagesDescriptions('interior');


//ERROR IN MODEL TYPE //TODO: FIX
// export const generateImageDescription = async (url = 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png'): Promise<number[]> => {
//   const image_caption_generator = await pipeline('image-to-text', 'onnx-community/mgp-str-base');
  
//   // FROM URL
//   const features = await image_caption_generator(url);

//   // FROM FILE
//   // const imageBuffer = fs.readFileSync(imagePath);
//   // const features = await image_feature_extractor([imageBuffer]);

//   // const vectorArray = features.ort_tensor.data as Float32Array;

//   // const clsToken = Array.from(vectorArray.slice(0, 768));

//   console.log('features:', features);

//   return features;
// }

// generateImageDescription()