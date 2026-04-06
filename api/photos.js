import dbConnect from './utils/db.js';
import Photo from './models/Photo.js';

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
      const { albumId } = req.query;
      let query = {};
      if (albumId) {
        query.albumId = albumId;
      }
      const photos = await Photo.find(query).sort({ order: 1 });
      return res.status(200).json({ success: true, data: photos });
    }

    if (req.method === 'POST') {
      const photo = await Photo.create(req.body);
      return res.status(201).json({ success: true, data: photo });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query; // mongo _id
      await Photo.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
