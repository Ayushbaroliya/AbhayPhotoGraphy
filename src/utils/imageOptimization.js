/**
 * Generates an optimized image URL for Cloudinary or Unsplash.
 * @param {string} url - The original image URL.
 * @param {number} width - The desired width (e.g., 400 for thumbnails, 1200 for full size).
 * @returns {string} The optimized URL.
 */
export const getOptimizedUrl = (url, width) => {
  if (!url) return '';

  // Cloudinary Optimization
  if (url.includes('res.cloudinary.com')) {
    const uploadPath = '/upload/';
    const uploadIndex = url.indexOf(uploadPath);
    
    if (uploadIndex !== -1) {
      const before = url.substring(0, uploadIndex + uploadPath.length);
      let after = url.substring(uploadIndex + uploadPath.length);
      
      // Remove any existing width transformation to prevent conflicts
      after = after.replace(/w_\d+,?/, '');
      after = after.replace(/c_scale,?/, '');
      after = after.replace(/q_auto,?/, '');
      after = after.replace(/f_auto,?/, '');
      // clear empty slash folders if any
      after = after.replace(/^\/+/, '');
      
      return `${before}c_scale,w_${width},q_auto,f_auto/${after}`;
    }
    return url;
  }

  // Unsplash Optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const baseUrl = new URL(url);
      baseUrl.searchParams.set('w', width.toString());
      baseUrl.searchParams.set('q', '75');
      baseUrl.searchParams.set('auto', 'format,compress');
      return baseUrl.toString();
    } catch (e) {
      const base = url.split('?')[0];
      return `${base}?w=${width}&q=75&auto=format,compress`;
    }
  }

  return url;
};
