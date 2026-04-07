import React, { useState, useEffect, useRef } from 'react';
import { getCarouselImages, addCarouselImage, deleteCarouselImage, uploadImage } from '../../services/api';

const CAROUSEL_TABS = ['Wedding', 'Pre-Wedding', 'Engagement', 'Reception'];

const AdminCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedTab, setSelectedTab] = useState(CAROUSEL_TABS[0]);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    try {
      const res = await getCarouselImages();
      if (res.success) setImages(res.data);
    } catch { setError('Failed to load images'); }
    finally { setLoading(false); }
  };

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setError('');
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) { setError('Please select an image first'); return; }
    setUploading(true);
    setUploadProgress(10);
    try {
      const uploadRes = await uploadImage(selectedFile, 'abhay-photography/carousel');
      setUploadProgress(70);
      if (!uploadRes.success) throw new Error(uploadRes.error || 'Upload failed');

      const saveRes = await addCarouselImage({
        src: uploadRes.url,
        publicId: uploadRes.publicId,
        tab: selectedTab,
        order: images.length,
      });
      setUploadProgress(100);
      if (saveRes.success) {
        setImages([...images, saveRes.data]);
        setSelectedFile(null);
        setPreview(null);
      }
    } catch (e) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image? It will also be removed from Cloudinary.')) return;
    try {
      const res = await deleteCarouselImage(id);
      if (res.success) setImages(images.filter(img => img._id !== id));
    } catch { setError('Delete failed'); }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: '1px solid var(--brown2)', borderRadius: '8px',
    background: 'rgba(255,255,255,0.6)', color: 'var(--brown)',
    fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ color: 'var(--brown)' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', marginBottom: '1.5rem' }}>
        Carousel Images
      </h2>

      {/* Upload Card */}
      <div style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid var(--brown3)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600', opacity: 0.8 }}>Upload New Image</h3>

        {/* Tab selector */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {CAROUSEL_TABS.map(tab => (
            <button key={tab} onClick={() => setSelectedTab(tab)}
              className={selectedTab === tab ? "btn-primary active-tab" : "btn-ghost"}
              style={{
                padding: '6px 16px', borderRadius: '20px',
                fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.2s'
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Drag-Drop Zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          style={{
            border: `2px dashed ${dragOver ? 'var(--brown)' : 'var(--brown3)'}`,
            borderRadius: '12px', padding: '2rem', textAlign: 'center',
            cursor: 'pointer', transition: 'all 0.2s', marginBottom: '1rem',
            background: dragOver ? 'rgba(0,0,0,0.03)' : 'transparent',
            minHeight: preview ? 'auto' : '140px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}>
          {preview ? (
            <>
              <img src={preview} alt="preview" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }} />
              <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '0.5rem' }}>Click to change image</p>
            </>
          ) : (
            <>
              <span style={{ fontSize: '2.5rem' }}>📷</span>
              <p style={{ margin: 0, fontWeight: '500' }}>Drag & drop or click to select</p>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>JPG, PNG, WEBP — max 20MB</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFileSelect(e.target.files[0])} />

        {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{error}</p>}

        {/* Progress bar */}
        {uploading && (
          <div style={{ background: 'var(--brown3)', borderRadius: '4px', height: '6px', marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--brown)', width: `${uploadProgress}%`, transition: 'width 0.4s ease', borderRadius: '4px' }} />
          </div>
        )}

        <button onClick={handleUpload} disabled={uploading || !selectedFile}
          className="btn-primary"
          style={{ width: '100%', padding: '12px', marginTop: '1rem', opacity: selectedFile ? 1 : 0.5 }}>
          {uploading ? `Uploading... ${uploadProgress}%` : 'Upload to Cloudinary'}
        </button>
      </div>

      {/* Images Grid */}
      <h3 style={{ fontSize: '1rem', fontWeight: '600', opacity: 0.8, marginBottom: '1rem' }}>
        Current Carousel ({images.length} images)
      </h3>
      {loading ? (
        <p style={{ opacity: 0.6 }}>Loading...</p>
      ) : images.length === 0 ? (
        <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem' }}>No carousel images yet. Upload one above.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {images.map(img => (
            <div key={img._id} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--brown3)', background: 'rgba(255,255,255,0.4)', position: 'relative' }}>
              <img src={img.src} alt="carousel" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', background: 'var(--brown3)', padding: '3px 10px', borderRadius: '12px', color: 'var(--brown)', fontWeight: '500' }}>
                  {img.tab || '—'}
                </span>
                <button onClick={() => handleDelete(img._id)} className="btn-danger-metallic">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCarousel;
