import { NextApiRequest, NextApiResponse } from 'next';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import OpenAI from 'openai';

const RECEIPT_PROMPT = `You are a receipt-to-nutrition normalization engine.\n\nYour task is to parse raw receipt text and extract only dietary food and beverage items, excluding non-edible products.\n\nFor each food item:\n\nInfer the full item name, brand, quantity, package size, and price using best-effort reasoning.\n\nIf nutritional data is missing, estimate it using typical standard references and clearly prefer conservative assumptions.\n\nSplit nutrition into macronutrients and micronutrients.\n\nNormalize all quantities to grams (g), assuming liquid density = 1 g/ml when required.\n\nNormalize nutrition to per 1 gram of food (kcal/g and g/g).\n\nCompute price per gram.\n\nOutput only valid JSON, with no commentary, using a clean and consistent schema.\n\nIf information is uncertain, preserve original wording rather than inventing details.\n\nIMPORTANT: Always output a valid JSON array of items, e.g. [{name: string, price: number, macros: {protein: number, carbs: number, fiber: number, fat: number}, micros: {vitaminB12: number, vitaminD: number, omega3: number, iron: number, zinc: number, iodine: number}}]. If you cannot extract any items, return an empty array []. Do not return any text or commentary outside the JSON.\n\nExample schema:\n[\n  {\n    "name": "Full Item Name",\n    "price": 3.99,\n    "macros": { "protein": 0, "carbs": 0, "fiber": 0, "fat": 0 },\n    "micros": { "vitaminB12": 0, "vitaminD": 0, "omega3": 0, "iron": 0, "zinc": 0, "iodine": 0 }\n  }\n]`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { imageData } = req.body;
  if (!imageData) {
    return res.status(400).json({ error: 'Missing imageData' });
  }

  try {
    // Initialize client with credentials from environment
    const credentials = process.env.GOOGLE_CREDENTIALS_BASE64
      ? JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString())
      : undefined;
    
    const client = new ImageAnnotatorClient(
      credentials ? { credentials } : {}
    );
    
    const base64 = imageData.replace(/^data:image\/(png|jpeg);base64,/, '');
    const [result] = await client.textDetection({ image: { content: base64 } });

    const detections = result.textAnnotations;
    let ocrText = detections && detections.length > 0 ? detections[0].description : '';
    console.log('OCR TEXT:', ocrText);

    if (!ocrText) {
      return res.status(200).json({ items: [] });
    }

    // Preprocess: filter lines that look like food items (simple regex for price and product)
    const lines = ocrText.split('\n');
    const foodLines = lines.filter(line => /\b\d+[.,]\d{2}\b/.test(line) && /[A-Za-z]/.test(line));
    const filteredText = foodLines.join('\n');

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('Missing OpenAI API key');
      return res.status(500).json({ error: 'Missing OpenAI API key' });
    }
    const openai = new OpenAI({ apiKey: openaiApiKey });

    let completion, response, items = [];
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: RECEIPT_PROMPT },
          { role: 'user', content: ocrText }
        ],
        temperature: 0.2,
        max_tokens: 1500
      });
      response = completion.choices[0].message.content;
      console.log('OPENAI RESPONSE:', response);
    } catch (openaiErr) {
      console.error('OpenAI API error:', openaiErr);
      return res.status(500).json({ error: openaiErr.message || 'OpenAI API error', details: openaiErr });
    }
    try {
      items = JSON.parse(response);
      // Enforce macros/micros defaults if missing
      items = Array.isArray(items) ? items.map(item => ({
        ...item,
        macros: {
          protein: item.macros?.protein ?? 0,
          carbs: item.macros?.carbs ?? 0,
          fiber: item.macros?.fiber ?? 0,
          fat: item.macros?.fat ?? 0,
        },
        micros: {
          vitaminB12: item.micros?.vitaminB12 ?? 0,
          vitaminD: item.micros?.vitaminD ?? 0,
          omega3: item.micros?.omega3 ?? 0,
          iron: item.micros?.iron ?? 0,
          zinc: item.micros?.zinc ?? 0,
          iodine: item.micros?.iodine ?? 0,
        }
      })) : items;
    } catch (e) {
      console.error('JSON parse error:', e, 'Response:', response);
      // If not valid JSON, return as raw string
      return res.status(200).json({ items: response });
    }
    res.status(200).json({ items });
  } catch (err) {
    console.error('Vision/OpenAI API error:', err);
    res.status(500).json({ error: err.message || 'Vision/OpenAI API error', details: err });
  }
}
