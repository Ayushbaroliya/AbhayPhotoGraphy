import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
app.use(cors());
app.use(express.json());

// Catch unhandled rejections to prevent silent crashes
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Adapter: Vercel serverless functions to Express
const adapt = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error('❌ Route error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};

// Load all API handlers
try {
  const { default: authHandler } = await import('./backend/auth.js');
  const { default: carouselHandler } = await import('./backend/carousel.js');
  const { default: albumsHandler } = await import('./backend/albums.js');
  const { default: photosHandler } = await import('./backend/photos.js');
  const { default: videosHandler } = await import('./backend/videos.js');
  const { default: pricingHandler } = await import('./backend/pricing.js');
  const { default: uploadHandler } = await import('./backend/upload.js');
  const { default: uploadMiddleware } = await import('./backend/uploadMiddleware.js');

  app.all('/api/auth', adapt(authHandler));
  app.all('/api/carousel', adapt(carouselHandler));
  app.all('/api/albums', adapt(albumsHandler));
  app.all('/api/photos', adapt(photosHandler));
  app.all('/api/videos', adapt(videosHandler));
  app.all('/api/pricing', adapt(pricingHandler));

  // Upload route: locally use multer, on Vercel use the manual raw body parser
  app.post('/api/upload', (req, res, next) => {
    console.log('[SERVER] Incoming request to /api/upload:', req.headers['content-type']);
    next();
  }, process.env.VERCEL ? (req, res, next) => next() : uploadMiddleware, adapt(uploadHandler));

  console.log('✅ All API routes loaded successfully');
} catch (err) {
  console.error('❌ Failed to load API handlers:', err.message);
  process.exit(1);
}

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
    } else {
      console.error('❌ Server error:', err);
    }
    process.exit(1);
  });
}

export default app;
