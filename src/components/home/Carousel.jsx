import React, { useState, useEffect } from 'react';
import { getOptimizedUrl } from '../../utils/imageOptimization';
import { fetchCarousel } from '../../services/mockApi';

const Carousel = () => {
  const [imgs, setImgs] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await fetchCarousel();
      if (res && res.success && res.data && res.data.length >= 3) {
        setImgs(res.data);
      } else {
        // Safe fallback if API fails or returns < 3 items so the UI doesn't break
        setImgs([
          { src: 'fallback', tab: 'fallback' },
          { src: 'fallback', tab: 'fallback' },
          { src: 'fallback', tab: 'fallback' }
        ]);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const n = imgs.length;

  useEffect(() => {
    if (loading || imgs.length === 0) return;
    const auto = setInterval(() => {
      setActive((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(auto);
  }, [loading, imgs]);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const radius = isMobile ? 320 : 550;
  const theta = n > 0 ? 360 / n : 0;

  const handleNav = (i) => {
    if (n === 0) return;
    const currentNorm = ((active % n) + n) % n;
    let delta = i - currentNorm;
    if (delta > Math.floor(n/2)) delta -= n;
    if (delta < -Math.floor(n/2)) delta += n;
    setActive(active + delta);
  };

  if (loading) {
    return (
      <div 
        className="carousel-wrap" 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          overflow: 'hidden',
          width: '100%',
          height: isMobile ? '400px' : '520px',
          marginTop: '40px',
          gap: isMobile ? '16px' : '20px'
        }}
      >
        {[1, 2, 3].map((_, i) => (
          <div 
            key={i} 
            className="shimmer"
            style={{
              width: isMobile ? '200px' : '280px', 
              height: isMobile ? '280px' : '400px',
              borderRadius: '16px',
              opacity: i === 1 ? 1 : 0.5,
              transform: i === 1 ? 'scale(1.05)' : 'scale(0.95)',
              flexShrink: 0
            }}
          ></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div 
        className="carousel-wrap" 
        style={{ 
          perspective: isMobile ? '900px' : '1500px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          overflow: 'hidden',
          width: '100%',
          height: isMobile ? '400px' : '520px',
          marginTop: '40px'
        }}
      >
        <div 
          style={{
            position: 'relative',
            width: isMobile ? '200px' : '280px', 
            height: isMobile ? '280px' : '400px',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: `translateZ(${radius}px) rotateY(${active * -theta}deg)`
          }}
        >
          {imgs.map((img, i) => {
            const normalizedActive = ((active % n) + n) % n;
            let diff = Math.abs(i - normalizedActive);
            if (diff > Math.floor(n/2)) diff = n - diff;

            const angle = i * theta;

            const op = diff > 2 ? 0 : (diff === 2 ? 0.1 : (diff === 1 ? 0.5 : 1));
            const blurVal = diff === 0 ? 0 : (diff === 1 ? 2 : 6);
            const isClickable = diff <= 1;

            return (
              <div 
                key={i} 
                style={{
                  position: 'absolute',
                  left: 0, top: 0,
                  width: '100%', height: '100%',
                  transform: `rotateY(${angle}deg) translateZ(${-radius}px)`,
                  opacity: op,
                  filter: `blur(${blurVal}px)`,
                  transition: 'opacity 0.6s, box-shadow 0.6s, filter 0.6s',
                  pointerEvents: isClickable ? 'auto' : 'none',
                  boxShadow: diff === 0 ? '0 30px 60px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: isClickable ? 'pointer' : 'default'
                }}
                onClick={() => isClickable && handleNav(i)}
              >
                {img.src !== 'fallback' ? (
                  <img src={getOptimizedUrl(img.src, 600)} alt="wedding" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                ) : (
                  <div className="shimmer" style={{ width: '100%', height: '100%' }}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="c-dots" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        {imgs.map((_, i) => (
          <div 
            key={i} 
            className={`c-dot ${i === ((active % n) + n) % n ? 'active' : ''}`} 
            onClick={() => handleNav(i)}
          ></div>
        ))}
      </div>
      
      <style>{`.mobile-carousel { display: none !important; } .desktop-only { display: none !important; } .carousel-wrap { animation: none; opacity: 1; }`}</style>
    </>
  );
};

export default Carousel;
