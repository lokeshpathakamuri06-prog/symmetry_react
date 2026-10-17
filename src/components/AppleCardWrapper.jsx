import React from 'react';

/**
 * AppleCardWrapper: the shared tile for product, project, journal and feature cards.
 * White on the grey page (grey inside a .band-white section), 28 px corners, no border.
 * On hover it lifts 1% with a soft shadow; photos inside marked `tile-media` zoom gently.
 * Pure CSS, so a grid of cards costs no JavaScript per card.
 */
export const AppleCardWrapper = ({ children, className = '', onClick, ...props }) => (
  <div onClick={onClick} className={`card-apple card-apple-hover group relative overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

export default AppleCardWrapper;
