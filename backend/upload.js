import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    if (Buffer.isBuffer(req.body)) return resolve(req.body);
    if (typeof req.body === 'string') return resolve(Buffer.from(req.body));
    if (req.complete && req.body && Object.keys(req.body).length === 0) {
       // weird Edge case where stream is closed and body is empty object
       console.log('[UPLOAD] req stream is complete but empty body');
    }
    
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
    
    // If it's already ended before we listen
    if (req.complete && chunks.length === 0) {
      resolve(Buffer.from(''));
    }
  });

// Extract boundary from content-type header
const getBoundary = (contentType) => {
  const match = contentType?.match(/boundary=([^;]+)/);
  return match ? match[1] : null;
};

// Minimal multipart parser — extracts the first file field
const parseMultipart = (buffer, boundary) => {
  const boundaryBuf = Buffer.from(`--${boundary}`);
  const parts = [];
  let start = 0;

  while (start < buffer.length) {
    const bIdx = buffer.indexOf(boundaryBuf, start);
    if (bIdx === -1) break;
    const headerStart = bIdx + boundaryBuf.length + 2; // skip \r\n
    const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), headerStart);
    if (headerEnd === -1) break;

    const headerStr = buffer.slice(headerStart, headerEnd).toString();
    const dataStart = headerEnd + 4;
    let dataEnd = buffer.indexOf(Buffer.from(`\r\n--${boundary}`), dataStart);
    if (dataEnd === -1) dataEnd = buffer.length;

    if (headerStr.includes('filename=') && headerStr.includes('name="image"')) {
      const mimeMatch = headerStr.match(/Content-Type:\s*([^\r\n]+)/i);
      parts.push({
        data: buffer.slice(dataStart, dataEnd),
        mimetype: mimeMatch ? mimeMatch[1].trim() : 'image/jpeg',
      });
    } else if (headerStr.includes('name="folder"')) {
      parts.folder = buffer.slice(dataStart, dataEnd).toString().trim();
    }
    start = dataEnd;
  }

  return parts;
};

const uploadToCloudinary = (buffer, folder, mimetype) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder || 'abhay-photography', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  try {
    const contentType = req.headers['content-type'] || '';
    const boundary = getBoundary(contentType);
    console.log('[UPLOAD] Content-Type:', contentType, 'Boundary:', boundary);
    
    if (!boundary) return res.status(400).json({ success: false, message: 'No multipart boundary found' });

    // If Express already parsed it via multer middleware, req.file exists
    let fileBuffer, folder, mimetype;

    console.log('[UPLOAD] req.file exists?', !!req.file);
    if (req.file) {
      // Called from Express server with multer
      fileBuffer = req.file.buffer;
      folder = req.body?.folder || 'abhay-photography';
      mimetype = req.file.mimetype;
      console.log('[UPLOAD] Using multer fallback. Folder:', folder, 'Mimetype:', mimetype, 'Size:', fileBuffer.length);
    } else {
      console.log('[UPLOAD] req.file missing. Fallback to manual raw body parse.');
      // Called from Vercel serverless — parse raw body manually
      console.log('[UPLOAD] Starting getRawBody...');
      const raw = await getRawBody(req);
      console.log('[UPLOAD] getRawBody finished. Size:', raw.length);
      
      const parts = parseMultipart(raw, boundary);
      console.log('[UPLOAD] parseMultipart parts count:', parts.length);
      
      if (!parts.length) return res.status(400).json({ success: false, message: 'No image file found in request' });
      fileBuffer = parts[0].data;
      folder = parts.folder || 'abhay-photography';
      mimetype = parts[0].mimetype;
      console.log('[UPLOAD] Manual parsed. Folder:', folder, 'Mimetype:', mimetype, 'File size:', fileBuffer.length);
    }

    console.log('[UPLOAD] Starting Cloudinary upload...');
    const result = await uploadToCloudinary(fileBuffer, folder, mimetype);
    console.log('[UPLOAD] Cloudinary success:', result.public_id);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('[UPLOAD ERROR] Exception:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// For Express: export multer middleware separately
export { default as uploadMiddleware } from './uploadMiddleware.js';
