import dbConnect from './utils/db.js';
import Album from './models/Album.js';

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
      const albums = await Album.find({});
      return res.status(200).json({ success: true, data: albums });
    }

    if (req.method === 'POST') {
      const album = await Album.create(req.body);
      return res.status(201).json({ success: true, data: album });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query; // This is the mongo _id
      await Album.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
