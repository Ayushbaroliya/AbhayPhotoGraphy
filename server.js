import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Dynamically load handlers after env is set
const { default: authHandler } = await import('./api/auth.js');
const { default: carouselHandler } = await import('./api/carousel.js');
const { default: albumsHandler } = await import('./api/albums.js');
const { default: photosHandler } = await import('./api/photos.js');
const { default: videosHandler } = await import('./api/videos.js');
const { default: pricingHandler } = await import('./api/pricing.js');

// Adapter: Vercel serverless functions to Express
const adapt = (handler) => async (req, res) => handler(req, res);

app.all('/api/auth', adapt(authHandler));
app.all('/api/carousel', adapt(carouselHandler));
app.all('/api/albums', adapt(albumsHandler));
app.all('/api/photos', adapt(photosHandler));
app.all('/api/videos', adapt(videosHandler));
app.all('/api/pricing', adapt(pricingHandler));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
