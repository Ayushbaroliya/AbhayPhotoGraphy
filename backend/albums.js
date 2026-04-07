import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import dbConnect from './utils/db.js';
import Album from './models/Album.js';
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
      const albums = await Album.find({});
      return res.status(200).json({ success: true, data: albums });
    }

    if (req.method === 'POST') {
      const album = await Album.create(req.body);
      return res.status(201).json({ success: true, data: album });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query; // mongo _id
      const album = await Album.findById(id);
      if (!album) return res.status(404).json({ success: false, message: 'Album not found' });

      // Cascade: delete all photos in this album from Cloudinary + DB
      const photos = await Photo.find({ albumId: album.id });
      for (const photo of photos) {
        if (photo.publicId) {
          try { await cloudinary.uploader.destroy(photo.publicId); } catch(e) {}
        }
      }
      await Photo.deleteMany({ albumId: album.id });

      // Delete album cover from Cloudinary
      if (album.coverPublicId) {
        try { await cloudinary.uploader.destroy(album.coverPublicId); } catch(e) {}
      }

      await Album.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
