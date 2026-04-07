import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import dbConnect from './utils/db.js';
import Photo from './models/Photo.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  try {
    await dbConnect();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'GET') {
      const { albumId } = req.query;
      const query = albumId ? { albumId } : {};
      const photos = await Photo.find(query).sort({ order: 1 });
      return res.status(200).json({ success: true, data: photos });
    }

    if (req.method === 'POST') {
      const photo = await Photo.create(req.body);
      return res.status(201).json({ success: true, data: photo });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const photo = await Photo.findById(id);
      if (photo?.publicId) {
        try {
          await cloudinary.uploader.destroy(photo.publicId);
        } catch (e) {
          console.error('Cloudinary delete failed:', e.message);
        }
      }
      await Photo.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
