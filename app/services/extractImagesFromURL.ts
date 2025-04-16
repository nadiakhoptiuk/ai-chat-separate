import fs from "fs";
import * as cheerio from 'cheerio';
import path from "path";
import { generateDescription } from "./generateDescriptions";

interface ImageDescription {
  generated_text: string;
}

interface ImageData {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  description?: ImageDescription;
}

const downloadImage = async (url: string, imgUrl: string, alt: string, folderName: string): Promise<string | undefined> => {
  try {
    if (!imgUrl) {
      console.error('No image URL provided');
      return;
    }

    const urlForDownload = new URL(imgUrl, url).href;
    const imageResponse = await fetch(urlForDownload);

    if (!imageResponse.ok) {
      console.error(`Failed to download image: ${imageResponse.status} - ${imageResponse.statusText}`);
      return;
    }
  
    const contentType = imageResponse.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image')) {
      console.error('Not an image, skipping:', urlForDownload);
      return;
    }
  
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let ext = 'jpg';
    if (contentType.includes('jpeg')) {
      ext = 'jpg';
    } else if (contentType.includes('png')) {
      ext = 'png';
    } else if (contentType.includes('gif')) {
      ext = 'gif';
    } else if (contentType.includes('webp')) {
      ext = 'webp';
    }

    const fileName = `${alt || 'image'}-${Date.now()}.${ext}`;
    const filePath = path.join('public/images', folderName, fileName);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);
    console.log(`Image saved: ${fileName}`);
      
    return filePath;
  } catch (error) {
    console.error('Error downloading image:', error);
    return undefined;
  }
}

export const extractImagesFromURL = async (url: string, folderName: string): Promise<ImageData[]> => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} - ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const images = $('img');
    console.log('Found images:', images.length);

    const imageData: ImageData[] = [];
    
    await Promise.all(images.map(async (index, img) => {
      const image: ImageData = {
        src: $(img).attr('src'),
        alt: $(img).attr('alt') || `image-${index}`,
        width: $(img).attr('width'),
        height: $(img).attr('height'),
      };

      if (image.src) {
        const filePath = await downloadImage(url, image.src, image.alt || '', folderName);
        if (filePath) {
          try {
            // const description = await generateDescription(filePath);
            // image.description = description;
          } catch (error) {
            console.error('Error generating description:', error);
          }
        }
        imageData.push(image);
      }
    }));

    return imageData;
  } catch (error) {
    console.error('Error extracting images:', error);
    throw error;
  }
}


