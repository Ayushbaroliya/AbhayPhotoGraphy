import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const loginAdmin = async (password) => {
  const response = await api.post('/auth', { password });
  return response.data;
};

// Carousel Services
export const getCarouselImages = async () => {
  const response = await api.get('/carousel');
  return response.data;
};

export const addCarouselImage = async (data) => {
  const response = await api.post('/carousel', data);
  return response.data;
};

export const deleteCarouselImage = async (id) => {
  const response = await api.delete(`/carousel?id=${id}`);
  return response.data;
};

// Album Services
export const getAlbums = async () => {
  const response = await api.get('/albums');
  return response.data;
};

export const createAlbum = async (data) => {
  const response = await api.post('/albums', data);
  return response.data;
};

export const deleteAlbum = async (id) => {
  const response = await api.delete(`/albums?id=${id}`);
  return response.data;
};

// Photo Services
export const getPhotos = async (albumId) => {
  const response = await api.get(`/photos?albumId=${albumId}`);
  return response.data;
};

export const addPhoto = async (data) => {
  const response = await api.post('/photos', data);
  return response.data;
};

export const deletePhoto = async (id) => {
  const response = await api.delete(`/photos?id=${id}`);
  return response.data;
};

// Video Services
export const getVideos = async () => {
  const response = await api.get('/videos');
  return response.data;
};

export const addVideo = async (data) => {
  const response = await api.post('/videos', data);
  return response.data;
};

export const deleteVideo = async (id) => {
  const response = await api.delete(`/videos?id=${id}`);
  return response.data;
};

// Pricing Services
export const getPricing = async () => {
  const response = await api.get('/pricing');
  return response.data;
};

export const addPricing = async (data) => {
  const response = await api.post('/pricing', data);
  return response.data;
};

export const updatePricing = async (id, data) => {
  const response = await api.put(`/pricing?id=${id}`, data);
  return response.data;
};

export const deletePricing = async (id) => {
  const response = await api.delete(`/pricing?id=${id}`);
  return response.data;
};

export default api;
