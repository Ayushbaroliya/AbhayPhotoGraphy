import React, { useEffect } from 'react';
import { getOptimizedUrl } from '../../utils/imageOptimization';

const Lightbox = ({ isOpen, onClose, images, currentIndex, setCurrentIndex }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
    };
    document.addEventListener('keydown', handleKeyDown);
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, images.length, onClose, setCurrentIndex]);

  if (!isOpen) return null;

  return (
    <div className="lb-overlay open">
      <button className="lb-close" onClick={onClose}>✕</button>
      <button className="lb-arrow lb-prev" onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }}>‹</button>
      <img className="lb-img" src={getOptimizedUrl(images[currentIndex].src, 1600)} alt="wedding full size" loading="lazy" onClick={(e) => e.stopPropagation()} />
      <button className="lb-arrow lb-next" onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); }}>›</button>
    </div>
  );
};

export default Lightbox;
