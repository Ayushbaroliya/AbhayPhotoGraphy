import dbConnect from './utils/db.js';
import About from './models/About.js';
import { verifyToken } from './auth.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const about = await About.findOne().sort({ updatedAt: -1 });
      return res.status(200).json({ success: true, data: about || {} });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const user = verifyToken(req);
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      // Find existing one or update
      let about = await About.findOne();
      if (about) {
        Object.assign(about, req.body);
        about.updatedAt = Date.now();
        await about.save();
      } else {
        about = await About.create(req.body);
      }

      return res.status(200).json({ success: true, data: about });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
