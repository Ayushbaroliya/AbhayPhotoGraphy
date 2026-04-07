import React, { useState, useEffect } from 'react';
import { getOptimizedUrl } from '../../utils/imageOptimization';
import { fetchCarousel } from '../../services/mockApi';

export const fallbackImgs = [
  { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&h=700&fit=crop&q=80', tab: 'reception' },
  { src: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=500&h=700&fit=crop&q=80', tab: 'mehendi' },
  { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500&h=700&fit=crop&q=80', tab: 'haldi' },
  { src: 'https://images.unsplash.com/photo-1595981234058-a9302fb97229?w=500&h=700&fit=crop&q=80', tab: 'reception' },
  { src: 'https://images.unsplash.com/photo-1609151354039-60abbc843a21?w=500&h=700&fit=crop&q=80', tab: 'mehendi' },
  { src: 'https://images.unsplash.com/photo-1622495966027-e0173192c728?w=500&h=700&fit=crop&q=80', tab: 'haldi' },
  { src: 'https://images.unsplash.com/photo-1600091166971-7f9faad6c2b2?w=500&h=700&fit=crop&q=80', tab: 'reception' },
];

const Carousel = () => {
  const [imgs, setImgs] = useState(fallbackImgs);
  const [active, setActive] = useState(0);
  const n = imgs.length;

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchCarousel();
      if (res && res.success && res.data && res.data.length >= 3) {
        setImgs(res.data);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const auto = setInterval(() => {
      setActive((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(auto);
  }, []);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // For a concave interior cylinder, radius controls how wide the arc is around the viewer
  const radius = isMobile ? 320 : 550;
  const theta = 360 / n;

  const handleNav = (i) => {
    const currentNorm = ((active % n) + n) % n;
    let delta = i - currentNorm;
    if (delta > Math.floor(n/2)) delta -= n;
    if (delta < -Math.floor(n/2)) delta += n;
    setActive(active + delta);
  };

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
            // Translate Z forward to sit in front of the viewer, establishing our viewpoint as the center of the cylinder!
            transform: `translateZ(${radius}px) rotateY(${active * -theta}deg)`
          }}
        >
          {imgs.map((img, i) => {
            const normalizedActive = ((active % n) + n) % n;
            let diff = Math.abs(i - normalizedActive);
            if (diff > Math.floor(n/2)) diff = n - diff;

            const angle = i * theta;

            // Dim and blur images aggressively as they wrap around the peripheral vision
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
                  // Translate Z backwards to establish the wall of the cylinder
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
                <img src={getOptimizedUrl(img.src, 600)} alt="wedding" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
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
