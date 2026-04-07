import dbConnect from './utils/db.js';
import Video from './models/Video.js';

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
      const videos = await Video.find({}).sort({ order: 1 });
      return res.status(200).json({ success: true, data: videos });
    }

    if (req.method === 'POST') {
      // Basic auth check would go here later
      const video = await Video.create(req.body);
      return res.status(201).json({ success: true, data: video });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Video.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
