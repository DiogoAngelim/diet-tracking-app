// Google Cloud Vision OCR Example in Node.js
// 1. Install dependencies: npm install @google-cloud/vision
// 2. Set up authentication: https://cloud.google.com/docs/authentication/getting-started
// 3. Usage: node ocr.js /path/to/image.png


require('dotenv').config();
const vision = require('@google-cloud/vision');
const path = require('path');

const { Configuration, OpenAIApi } = require('openai');

const RECEIPT_PROMPT = `You are a receipt-to-nutrition normalization engine.\n\nYour task is to parse raw receipt text and extract only dietary food and beverage items, excluding non-edible products.\n\nFor each food item:\n\nInfer the full item name, brand, quantity, package size, and price using best-effort reasoning.\n\nIf nutritional data is missing, estimate it using typical standard references and clearly prefer conservative assumptions.\n\nSplit nutrition into macronutrients and micronutrients.\n\nNormalize all quantities to grams (g), assuming liquid density = 1 g/ml when required.\n\nNormalize nutrition to per 1 gram of food (kcal/g and g/g).\n\nCompute price per gram.\n\nOutput only valid JSON, with no commentary, using a clean and consistent schema.\n\nIf information is uncertain, preserve original wording rather than inventing details.`;

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node ocr.js <image-path>');
    process.exit(1);
  }
  const imagePath = args[0];

  // Google Vision OCR
  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.textDetection(imagePath);
  const detections = result.textAnnotations;
  let ocrText = '';
  if (detections && detections.length > 0) {
    ocrText = detections[0].description;
    console.log('OCR Result:');
    console.log(ocrText);
  } else {
    console.log('No text detected.');
    process.exit(1);
  }

  // OpenAI integration
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    console.error('Missing OPENAI_API_KEY in .env');
    process.exit(1);
  }
  const configuration = new Configuration({ apiKey: openaiApiKey });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: RECEIPT_PROMPT },
        { role: 'user', content: ocrText }
      ],
      temperature: 0.2,
      max_tokens: 1500
    });
    const response = completion.data.choices[0].message.content;
    console.log('\nOpenAI Nutrition JSON Output:');
    console.log(response);
  } catch (err) {
    console.error('OpenAI API Error:', err.response?.data || err.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
