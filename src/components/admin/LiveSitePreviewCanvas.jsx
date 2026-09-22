import React from 'react';
import Home from '../../pages/Home';
import About from '../../pages/About';
import Services from '../../pages/Services';
import Sourcing from '../../pages/Sourcing';
import Contact from '../../pages/Contact';

export const LiveSitePreviewCanvas = ({ activePage = 'home', viewport = 'desktop' }) => {
  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] shadow-2xl border-[10px] border-[#1B2E3D] rounded-[40px]';
      case 'tablet':
        return 'w-[768px] h-[900px] shadow-2xl border-[12px] border-[#1B2E3D] rounded-[24px]';
      case 'desktop':
      default:
        return 'w-full h-full border border-[#1B2E3D] rounded-xl';
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'about':
        return <About />;
      case 'services':
        return <Services />;
      case 'sourcing':
        return <Sourcing />;
      case 'contact':
        return <Contact />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 overflow-auto bg-[#050C13]">
      <div 
        className={`bg-[#07121C] text-[#F5F1E8] overflow-y-auto transition-all duration-300 relative custom-scrollbar ${getViewportWidth()}`}
      >
        {/* Top Simulated Browser Bar for Mobile & Tablet */}
        {viewport !== 'desktop' && (
          <div className="sticky top-0 z-50 bg-[#0A1622] border-b border-[#1B2E3D] px-4 py-2 flex items-center justify-between text-[10px] text-white/50">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Preview ({viewport})
            </span>
            <span className="font-mono text-white/40">https://symmetry.com/{activePage === 'home' ? '' : activePage}</span>
          </div>
        )}

        {/* Render Page Component */}
        <div className="pointer-events-auto">
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
};

export default LiveSitePreviewCanvas;
