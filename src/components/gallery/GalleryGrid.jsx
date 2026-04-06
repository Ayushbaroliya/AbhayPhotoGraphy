import React, { useState, useEffect } from 'react';
import Lightbox from './Lightbox';
import { fetchAlbums, fetchAlbumPhotos } from '../../services/mockApi';
import { getOptimizedUrl } from '../../utils/imageOptimization';

const GalleryGrid = () => {
  // State for Albums Data
  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  // State for the currently selected Album & Photos
  const [selectedAlbum, setSelectedAlbum] = useState(null); // the album object
  const [albumPhotos, setAlbumPhotos] = useState(null); // the object of photos mapped by event
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  // Local UI State
  const [tab, setTab] = useState('all');
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  // 1. Fetch the list of albums on mount (Root Level)
  useEffect(() => {
    const loadAlbums = async () => {
      try {
        setLoadingAlbums(true);
        const res = await fetchAlbums();
        if (res.success) {
          setAlbums(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch albums: ", error);
      } finally {
        setLoadingAlbums(false);
      }
    };
    loadAlbums();
  }, []);

  // 2. Fetch specific album photos when an album is clicked (Event Level)
  const handleSelectAlbum = async (album) => {
    setSelectedAlbum(album);
    setTab('all');
    try {
      setLoadingPhotos(true);
      const res = await fetchAlbumPhotos(album.id);
      if (res.success) {
        setAlbumPhotos(res.data);
      }
    } catch (error) {
      console.error("Failed to load album photos: ", error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleBackToAlbums = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedAlbum(null);
    setAlbumPhotos(null);
    setTab('all');
  };

  // Determine which array of photos to show based on the active tab
  const filteredImgs = albumPhotos ? (albumPhotos[tab] || []) : [];

  const openLightbox = (index) => {
    setLbIndex(index);
    setLbOpen(true);
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-header" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
        <div>
          {selectedAlbum ? (
            <button 
              type="button"
              className="back-btn" 
              onClick={handleBackToAlbums} 
              style={{ position: 'relative', zIndex: 10, padding: '0.6rem 1.2rem', marginBottom: '1rem', cursor: 'pointer', background: 'transparent', color: 'var(--red)', border: '1px solid var(--red)', borderRadius: '25px', fontWeight: 'bold' }}
            >
              ← Back to Albums
            </button>
          ) : (
            <p className="section-label">Our portfolio</p>
          )}
          
          <h2 className="section-title">
            {selectedAlbum ? (
              selectedAlbum.title
            ) : (
              <>Weddings we've<br /><em style={{ fontFamily: "'Cormorant Garamond', serif" }}>cherished</em></>
            )}
          </h2>
        </div>

        {selectedAlbum && !loadingPhotos && albumPhotos && (
          <div>
            <div className="wedding-tabs" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
              {selectedAlbum.availableEvents.map((eventName) => (
                <button
                  key={eventName}
                  className={`wtab ${tab === eventName ? 'active' : ''}`}
                  onClick={() => setTab(eventName)}
                >
                  {eventName.charAt(0).toUpperCase() + eventName.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="gallery-grid" style={{ minHeight: '300px' }}>
        {/* Loading States */}
        {!selectedAlbum && loadingAlbums && (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--brown2)' }}>Loading awesome moments...</p>
        )}
        
        {selectedAlbum && loadingPhotos && (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--brown2)' }}>Fetching memories...</p>
        )}

        {/* View 1: Root Albums grid */}
        {!selectedAlbum && !loadingAlbums && albums.map((album) => (
          <div key={album.id} className="gallery-item album-card frame-card" onClick={() => handleSelectAlbum(album)}>
            <div className="frame-img-wrapper">
              <img src={getOptimizedUrl(album.coverImage, 600)} alt={album.title} loading="lazy" className="album-cover" />
            </div>
            <div className="frame-caption">
              {album.title} Wedding
            </div>
          </div>
        ))}

        {/* View 2: Specific Photos Grid */}
        {selectedAlbum && !loadingPhotos && albumPhotos && filteredImgs.map((img, i) => (
          <div key={i} className="gallery-item photo-card" onClick={() => openLightbox(i)}>
            <img src={getOptimizedUrl(img.src, 400)} alt={img.alt || 'photo'} loading="lazy" />
            <div className="gallery-overlay">
              <span>View Full Size</span>
            </div>
          </div>
        ))}
      </div>

      <Lightbox 
        isOpen={lbOpen} 
        onClose={() => setLbOpen(false)} 
        images={filteredImgs} 
        currentIndex={lbIndex} 
        setCurrentIndex={setLbIndex} 
      />
    </section>
  );
};

export default GalleryGrid;

