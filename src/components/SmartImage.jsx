import React, { useState } from 'react';
import { isCloudinary, isUnsplash, placeholderUrl, sizedUrl, srcSet } from '../lib/images';
import { useImageAlt } from '../context/PublicContentContext';

// Responsive image for content photos. Cloudinary and Unsplash images get srcset (right size per screen),
// automatic AVIF/WebP and a blurred placeholder; any other URL renders as a normal lazy <img>.
//   sizes: how wide the image is on screen, e.g. "(min-width: 1024px) 33vw, 100vw"
//   priority: the main image above the fold (hero, product main photo): load first, no lazy
export const SmartImage = ({ src, alt = '', sizes = '100vw', priority = false, className = '', style, onLoad, onError, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  // Media Library alt text wins: it describes the photo itself, not just the item it belongs to
  const libraryAlt = useImageAlt(src);
  if (!src) return null;
  const cloud = isCloudinary(src) || isUnsplash(src);
  const placeholder = cloud && !loaded ? placeholderUrl(src) : undefined;

  return (
    <img
      src={cloud ? sizedUrl(src, { width: 1200 }) : src}
      srcSet={cloud ? srcSet(src) : undefined}
      sizes={cloud ? sizes : undefined}
      alt={libraryAlt || alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? "high" : undefined}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        // Callers swap in a fallback by changing src; srcset would override it, so drop it first
        e.currentTarget.removeAttribute('srcset');
        e.currentTarget.style.backgroundImage = 'none';
        onError?.(e);
      }}
      className={className}
      style={placeholder ? { backgroundImage: `url("${placeholder}")`, backgroundSize: 'cover', backgroundPosition: 'center', ...style } : style}
      {...rest}
    />
  );
};

export default SmartImage;
