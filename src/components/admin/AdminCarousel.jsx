import React, { useState, useEffect } from 'react';
import { getCarouselImages, addCarouselImage, deleteCarouselImage } from '../../services/api';

const AdminCarousel = () => {
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState({ imageUrl: '', altText: '', order: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await getCarouselImages();
      if (res.success) setImages(res.data);
    } catch (error) {
      console.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await addCarouselImage(newImage);
      if (res.success) {
        setImages([...images, res.data]);
        setNewImage({ imageUrl: '', altText: '', order: 0 });
      }
    } catch (error) {
      console.error('Failed to add image');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteCarouselImage(id);
      if (res.success) {
        setImages(images.filter(img => img._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete image');
    }
  };

  return (
    <div style={{ background: 'var(--cream2)', padding: '2rem', borderRadius: '12px', color: 'var(--brown)' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '1.5rem' }}>Manage Carousel</h2>
      
      <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
        <input 
          type="text" 
          placeholder="Image URL (Cloudinary etc)" 
          value={newImage.imageUrl} 
          onChange={(e) => setNewImage({...newImage, imageUrl: e.target.value})} 
          required 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="text" 
          placeholder="Alt Text" 
          value={newImage.altText} 
          onChange={(e) => setNewImage({...newImage, altText: e.target.value})} 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="number" 
          placeholder="Order (optional)" 
          value={newImage.order} 
          onChange={(e) => setNewImage({...newImage, order: parseInt(e.target.value) || 0})} 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <button type="submit" className="btn-primary" style={{ width: 'max-content' }}>Add Image</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {images.map(img => (
            <div key={img._id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--brown3)' }}>
              <img src={img.imageUrl} alt={img.altText} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
              <button 
                onClick={() => handleDelete(img._id)}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--red)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
              >
                Delete
              </button>
              <div style={{ padding: '8px', background: 'var(--cream)', fontSize: '0.85rem' }}>Order: {img.order}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCarousel;
