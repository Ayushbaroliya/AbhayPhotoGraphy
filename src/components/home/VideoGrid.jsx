import React, { useState, useEffect, useRef } from 'react';
import { fetchVideos } from '../../services/mockApi';

const VideoGrid = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetchVideos();
        if (response.success) {
          setVideos(response.data);
        }
      } catch (error) {
        console.error("Failed to load videos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVideos();
  }, []);

  const slide = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8;
      if (direction === 'left') {
        sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('youtube.com/watch?v=', 'youtube.com/embed/').split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
    }
    return url;
  };

  return (
    <section className="videos-section" id="videos">
      <p className="section-label">Cinematic Films</p>
      <h2 className="section-title">Watch our <em style={{ fontFamily: "'Cormorant Garamond', serif" }}>stories</em> unfold</h2>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--brown3)' }}>Loading videos...</div>
      ) : (
        <div className="videos-slider-container">
          {videos.length > 3 && (
            <>
              <button className="vs-arrow vs-prev" onClick={() => slide('left')}>‹</button>
              <button className="vs-arrow vs-next" onClick={() => slide('right')}>›</button>
            </>
          )}
          <div className="videos-slider" ref={sliderRef}>
            {videos.map((video) => (
              <div key={video.id} className="video-card">
                <div className="video-wrapper">
                  <iframe
                    src={getEmbedUrl(video.embedUrl)}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className="video-title">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoGrid;
