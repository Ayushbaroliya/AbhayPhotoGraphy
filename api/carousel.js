import dbConnect from './utils/db.js';
import Carousel from './models/Carousel.js';

export default async function handler(req, res) {
  try {
    await dbConnect();

    // CORS preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(200).end();
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'GET') {
      const images = await Carousel.find({}).sort({ order: 1 });
      return res.status(200).json({ success: true, data: images });
    }

    if (req.method === 'POST') {
      const image = await Carousel.create(req.body);
      return res.status(201).json({ success: true, data: image });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Carousel.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
