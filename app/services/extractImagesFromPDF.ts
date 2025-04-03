import fs from "fs";
import * as cheerio from 'cheerio';
import path from "path";


export const downloadImage = async (url: string, imgUrl: string, alt: string) => {
  try {
    const urlForDownload = new URL(imgUrl, url).href;
    const imageResponse = await fetch(urlForDownload);
  
    const contentType = imageResponse.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image')) {
      console.error('Not an image, skipping:');
      return;
    }
  
    const arrayBuffer  = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer)
    
    let ext = 'jpg'; // За замовчуванням
      if (contentType.includes('jpeg')) {
        ext = 'jpg';
      } else if (contentType.includes('png')) {
        ext = 'png';
      } else if (contentType.includes('gif')) {
        ext = 'gif';
      } else if (contentType.includes('webp')) {
        ext = 'webp';
      }

      const fileName = `${alt}.${ext}`; // Формуємо ім'я файлу для збереження
      const filePath = path.join('public/images', fileName);

      // Перевіряємо, чи є папка для збереження зображень, і створюємо її, якщо немає
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      // Записуємо файл на диск
      fs.writeFileSync(filePath, buffer);
      console.log(`Image saved: ${fileName}`);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
}


export const extractImagesFromURL = async (url: string) => {

  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const images = $('img');
  console.log('IMAGES >>>>', images.length);

  const imageData = images.map((index, img) => {
    return {
      src: $(img).attr('src'),
      alt: $(img).attr('alt'),
      width: $(img).attr('width'),
      height: $(img).attr('height'),
    };
  }).get();

  imageData.forEach(async (image) => {
    await downloadImage(url, image?.src, image?.alt);
  });

  console.log('IMAGE DATA >>>>', imageData);
  return imageData;
}