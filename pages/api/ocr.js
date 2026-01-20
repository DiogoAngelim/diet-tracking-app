import { NextApiRequest, NextApiResponse } from 'next';
import { ImageAnnotatorClient } from '@google-cloud/vision';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { imageData } = req.body;
  if (!imageData) {
    return res.status(400).json({ error: 'Missing imageData' });
  }

  try {
    const client = new ImageAnnotatorClient();
    // Remove data URL prefix if present
    const base64 = imageData.replace(/^data:image\/(png|jpeg);base64,/, '');
    const [result] = await client.textDetection({ image: { content: base64 } });
    const detections = result.textAnnotations;
    const text = detections && detections.length > 0 ? detections[0].description : '';
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Vision API error' });
  }
}
