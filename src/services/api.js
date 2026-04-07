import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const loginAdmin = async (password) => {
  const response = await api.post('/auth', { password });
  return response.data;
};
export const verifyAuth = async () => {
  const response = await api.get('/auth');
  return response.data;
};

// ── Upload (direct to Cloudinary via server) ──────────────────────────────────
export const uploadImage = async (file, folder = 'abhay-photography') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);
  const response = await axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
  });
  return response.data; // { success, url, publicId }
};

// ── Carousel ──────────────────────────────────────────────────────────────────
export const getCarouselImages = async () => (await api.get('/carousel')).data;
export const addCarouselImage = async (data) => (await api.post('/carousel', data)).data;
export const deleteCarouselImage = async (id) => (await api.delete(`/carousel?id=${id}`)).data;

// ── Albums ────────────────────────────────────────────────────────────────────
export const getAlbums = async () => (await api.get('/albums')).data;
export const createAlbum = async (data) => (await api.post('/albums', data)).data;
export const deleteAlbum = async (id) => (await api.delete(`/albums?id=${id}`)).data;

// ── Photos ────────────────────────────────────────────────────────────────────
export const getPhotos = async (albumId) => (await api.get(`/photos?albumId=${albumId}`)).data;
export const addPhoto = async (data) => (await api.post('/photos', data)).data;
export const deletePhoto = async (id) => (await api.delete(`/photos?id=${id}`)).data;

// ── Videos ───────────────────────────────────────────────────────────────────
export const getVideos = async () => (await api.get('/videos')).data;
export const addVideo = async (data) => (await api.post('/videos', data)).data;
export const deleteVideo = async (id) => (await api.delete(`/videos?id=${id}`)).data;

// ── Pricing ───────────────────────────────────────────────────────────────────
export const getPricing = async () => (await api.get('/pricing')).data;
export const addPricing = async (data) => (await api.post('/pricing', data)).data;
export const updatePricing = async (id, data) => (await api.put(`/pricing?id=${id}`, data)).data;
export const deletePricing = async (id) => (await api.delete(`/pricing?id=${id}`)).data;

// ── About ────────────────────────────────────────────────────────────────────
export const getAbout = async () => (await api.get('/about')).data;
export const updateAbout = async (data) => (await api.post('/about', data)).data;

export default api;
