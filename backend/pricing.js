import dbConnect from './utils/db.js';
import Pricing from './models/Pricing.js';

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
      const plans = await Pricing.find({});
      return res.status(200).json({ success: true, data: plans });
    }

    if (req.method === 'POST') {
      const plan = await Pricing.create(req.body);
      return res.status(201).json({ success: true, data: plan });
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const plan = await Pricing.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json({ success: true, data: plan });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Pricing.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
