import React from 'react';

// Hidden from people (off-screen, skipped by keyboard and screen readers); spam bots fill it in
export const Honeypot = ({ value, onChange }) => (
  <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
    <label>
      Website
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  </div>
);

export default Honeypot;
