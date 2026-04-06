import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api' // This aligns with Vercel's serverless function routing
});

/**
 * Fetch list of all albums (without photos)
 * GET /api/albums
 */
export const fetchAlbums = async () => {
  try {
    const response = await api.get('/albums');
    return response.data; // expects { success: true, data: [...] }
  } catch (error) {
    console.error("Error fetching albums:", error);
    return { success: false, data: [] };
  }
};

/**
 * Fetch photos for a specific album, organized by event
 * GET /api/photos?albumId=:id
 */
export const fetchAlbumPhotos = async (albumId) => {
  try {
    const response = await api.get(`/photos?albumId=${albumId}`);
    
    // Group photos by event because the database returns a flat array of photos for the album
    const photos = response.data.data;
    
    const organizedPhotos = {};
    const allPhotos = [];
    const allUrls = new Set();
    
    photos.forEach(photo => {
      if (!organizedPhotos[photo.event]) {
        organizedPhotos[photo.event] = [];
      }
      organizedPhotos[photo.event].push(photo);
      
      // Aggregate into 'all' tab
      if (!allUrls.has(photo.src)) {
        allUrls.add(photo.src);
        allPhotos.push(photo);
      }
    });
    
    organizedPhotos['all'] = allPhotos;

    return { success: true, albumId, data: organizedPhotos };
  } catch (error) {
    console.error("Error fetching album photos:", error);
    return { success: false, data: {} };
  }
};

export const fetchVideos = async () => {
  try {
    const response = await api.get('/videos');
    return response.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { success: false, data: [] };
  }
};

export const fetchCarousel = async () => {
  try {
    const response = await api.get('/carousel');
    return response.data;
  } catch (error) {
    console.error("Error fetching carousel:", error);
    return { success: false, data: [] };
  }
};

export const fetchPricing = async () => {
  try {
    const response = await api.get('/pricing');
    return response.data;
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return { success: false, data: [] };
  }
};

