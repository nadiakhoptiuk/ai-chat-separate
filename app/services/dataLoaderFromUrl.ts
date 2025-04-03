// import * as cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export const loadDataFromUrl = async (url = 'https://www.shopify.com/about?shpxid=f7163912-8BA8-4489-E6EE-64943FB12AED') => {

// WITH CHEERIO - only returns content with tags or text content by selectors. We have to know the page structure.
  
  // const doc = cheerio.load(url);

  // const body = doc('body').text();
  // const description = doc('meta[name="description"]').attr('content');
  // const keywords = doc('meta[name="keywords"]').attr('content');
  // const content = doc('body').text();


// WITH READABILITY - returns the text content (with and without tags) of the page as a string. We don't have to know the page structure.
  
  const html = await fetch(url).then(res => res.text());
  const doc = new JSDOM(html, { url });
  const reader = new Readability(doc.window.document);
  const content = reader.parse();
  const text = content?.textContent;

  const cleanText = (text: string): string => {
    const newText = text
      .replace(/\r/g, '')               // Видаляє \r (якщо є)
      .replace(/\n{3,}/g, '\n\n')       // Замінює 3+ переносів на 2 (щоб зберегти абзаци)
      .replace(/[ \t]+\n/g, '\n')       // Видаляє пробіли перед новим рядком
      .replace(/\n[ \t]+/g, '\n')       // Видаляє пробіли після нового рядка
    
    return newText === text ? newText : cleanText(newText);  // Рекурсія, якщо ще є зайві переноси
  };

  console.log('text >>>>', cleanText(text ?? ''));

  return cleanText(text ?? '');
}

