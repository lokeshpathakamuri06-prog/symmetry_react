import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Check, 
  RotateCcw, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Home as HomeIcon, 
  Info, 
  Briefcase, 
  Compass, 
  PhoneCall, 
  Layout, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Eye,
  Sliders,
  Type,
  Maximize2,
  Minimize2,
  Layers,
  HelpCircle
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSiteContent } from '../../context/SiteContentContext';
import LiveSitePreviewCanvas from '../../components/admin/LiveSitePreviewCanvas';

export const AdminPageContent = () => {
  const { publishedContent, updatePageContent, setDraftContent } = useSiteContent();

  const [activePage, setActivePage] = useState('home');
  const [viewport, setViewport] = useState('desktop'); // desktop, tablet, mobile
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  // Draft Form State across all pages
  const [draftData, setDraftData] = useState(publishedContent || {});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Accordion open states
  const [openSections, setOpenSections] = useState({
    hero: true,
    categories: false,
    featured: false,
    story: false,
    newsletter: false,
    aboutHero: true,
    philosophy: false,
    servicesHero: true,
    faq: false,
    sourcingHero: true,
    contactHero: true,
    footerGlobal: true
  });

  const toggleSection = (sec) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Sync draft state to context whenever draftData changes
  useEffect(() => {
    setDraftContent(draftData);
  }, [draftData, setDraftContent]);

  // Reset draft on page change or unmount
  useEffect(() => {
    return () => {
      setDraftContent(null);
    };
  }, [setDraftContent]);

  const handleInputChange = (page, key, value) => {
    setDraftData(prev => {
      const updatedPage = { ...(prev[page] || {}), [key]: value };
      return { ...prev, [page]: updatedPage };
    });
  };

  const handlePublish = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updatePageContent(activePage, draftData[activePage] || {});
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDraft = () => {
    setDraftData(publishedContent);
    setDraftContent(null);
  };

  const pages = [
    { id: 'home', label: 'Home Page', icon: HomeIcon },
    { id: 'about', label: 'About Page', icon: Info },
    { id: 'services', label: 'Services Page', icon: Briefcase },
    { id: 'sourcing', label: 'Sourcing Page', icon: Compass },
    { id: 'contact', label: 'Contact Page', icon: PhoneCall },
    { id: 'footer', label: 'Footer & Global', icon: Layout }
  ];

  return (
    <AdminLayout title="Visual Studio Page Builder" subtitle="Side-by-side live website preview & section component editor">
      <div className="space-y-4 h-[calc(100vh-7rem)] flex flex-col">
        {/* Top Control Bar */}
        <div className="adm-card p-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          {/* Page Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {pages.map((p) => {
              const IconComp = p.icon;
              const isActive = activePage === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePage(p.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-adm-accent text-adm-on-accent shadow-md shadow-adm-accent/20 font-semibold'
                      : 'bg-adm-surface2 text-adm-fg/60 hover:text-adm-fg border border-adm-border'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Viewport Toggles & Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Viewport Modes */}
            <div className="hidden md:flex items-center bg-adm-surface2 border border-adm-border rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                  viewport === 'desktop' ? 'bg-adm-accent text-adm-on-accent font-medium' : 'text-adm-on-accent/50 hover:text-adm-on-accent'
                }`}
                title="Desktop View (100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                  viewport === 'tablet' ? 'bg-adm-accent text-adm-on-accent font-medium' : 'text-adm-on-accent/50 hover:text-adm-on-accent'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                  viewport === 'mobile' ? 'bg-adm-accent text-adm-on-accent font-medium' : 'text-adm-on-accent/50 hover:text-adm-on-accent'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reset Draft */}
            <button
              onClick={handleResetDraft}
              title="Reset unsaved changes"
              className="px-3 py-1.5 bg-adm-fg/5 hover:bg-adm-fg/10 text-adm-fg/70 hover:text-adm-fg rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>

            {/* Save & Publish */}
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-4 py-1.5 bg-adm-accent hover:bg-adm-accent-hover text-adm-on-accent rounded-xl text-xs font-medium flex items-center gap-2 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Publishing...' : 'Publish Live'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-fade-in shrink-0">
            <Check className="w-4 h-4" /> Live site content published successfully!
          </div>
        )}

        {/* Split Screen Workspace */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Control Panel (Section Accordions) - 4 cols */}
          <div className="lg:col-span-4 adm-card p-4 overflow-y-auto space-y-4 custom-scrollbar">
            <div className="pb-2 border-b border-adm-border flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-adm-fg/50 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-adm-accent" /> {pages.find(p => p.id === activePage)?.label} Components
              </span>
              <span className="text-[10px] text-adm-accent font-mono">Live Sync</span>
            </div>

            {/* 1. HOME PAGE CONTROLS */}
            {activePage === 'home' && (
              <div className="space-y-3">
                {/* Hero Banner Accordion */}
                <div className="border border-adm-border rounded-xl overflow-hidden bg-adm-surface2">
                  <button
                    onClick={() => toggleSection('hero')}
                    className="w-full px-4 py-3 bg-adm-surface flex items-center justify-between text-xs font-semibold text-adm-fg hover:bg-adm-fg/5"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-adm-accent" /> Hero Banner Section
                    </span>
                    {openSections.hero ? <ChevronDown className="w-4 h-4 text-adm-fg/50" /> : <ChevronRight className="w-4 h-4 text-adm-fg/50" />}
                  </button>
                  {openSections.hero && (
                    <div className="p-4 space-y-3 text-xs">
                      <div>
                        <label className="block text-adm-fg/70 mb-1">Main Hero Heading</label>
                        <input
                          type="text"
                          value={draftData.home?.heroTitle || ''}
                          onChange={(e) => handleInputChange('home', 'heroTitle', e.target.value)}
                          className="w-full px-3 py-2 bg-adm-surface border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-adm-fg/70 mb-1">Hero Subtitle</label>
                        <textarea
                          rows={2}
                          value={draftData.home?.heroSubtitle || ''}
                          onChange={(e) => handleInputChange('home', 'heroSubtitle', e.target.value)}
                          className="w-full px-3 py-2 bg-adm-surface border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-adm-fg/70 mb-1">CTA Button Text</label>
                        <input
                          type="text"
                          value={draftData.home?.heroCtaText || ''}
                          onChange={(e) => handleInputChange('home', 'heroCtaText', e.target.value)}
                          className="w-full px-3 py-2 bg-adm-surface border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Categories Accordion */}
                <div className="border border-adm-border rounded-xl overflow-hidden bg-adm-surface2">
                  <button
                    onClick={() => toggleSection('categories')}
                    className="w-full px-4 py-3 bg-adm-surface flex items-center justify-between text-xs font-semibold text-adm-fg hover:bg-adm-fg/5"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-adm-accent" /> Categories Section Header
                    </span>
                    {openSections.categories ? <ChevronDown className="w-4 h-4 text-adm-fg/50" /> : <ChevronRight className="w-4 h-4 text-adm-fg/50" />}
                  </button>
                  {openSections.categories && (
                    <div className="p-4 space-y-3 text-xs">
                      <div>
                        <label className="block text-adm-fg/70 mb-1">Categories Heading</label>
                        <input
                          type="text"
                          value={draftData.home?.categoriesHeading || ''}
                          onChange={(e) => handleInputChange('home', 'categoriesHeading', e.target.value)}
                          className="w-full px-3 py-2 bg-adm-surface border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-adm-fg/70 mb-1">Categories Subtext</label>
                        <input
                          type="text"
                          value={draftData.home?.categoriesSub || ''}
                          onChange={(e) => handleInputChange('home', 'categoriesSub', e.target.value)}
                          className="w-full px-3 py-2 bg-adm-surface border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Brand Story Accordion */}
                <div className="border border-adm-border rounded-xl overflow-hidden bg-adm-surface2">
                  <button
                    onClick={() => toggleSection('story')}
                    className="w-full px-4 py-3 bg-adm-surface flex items-center justify-between text-xs font-semibold text-adm-fg hover:bg-adm-fg/5"
                  >
                    <span className="flex items-center gap-2">
                      <Type className="w-3.5 h-3.5 text-adm-accent" /> Brand Story & Provenance
                    </span>
                    {openSections.story ? <ChevronDown className="w-4 h-4 text-adm-fg/50" /> : <ChevronRight className="w-4 h-4 text-adm-fg/50" />}
                  </button>
                  {openSections.story && (
                    <div className="p-4 space-y-3 text-xs">
                      <div>
                        <label className="block text-adm-fg/70 mb-1">Story Heading</label>
                        <input
                          type="text"
                          value={draftData.home?.brandStoryHeading || ''}
                          onChange={(e) => handleInputChange('home', 'brandStoryHeading', e.target.value)}
                          className="w-full px-3 py-2 bg-adm-surface border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-adm-fg/70 mb-1">Story Main Paragraph</label>
                        <textarea
                          rows={3}
                          value={draftData.home?.brandStoryText || ''}
                          onChange={(e) => handleInputChange('home', 'brandStoryText', e.target.value)}
                          className="w-full px-3 py-2 bg-adm-surface border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Newsletter Accordion */}
                <div className="border border-adm-border rounded-xl overflow-hidden bg-adm-surface2">
                  <button
                    onClick={() => toggleSection('newsletter')}
                    className="w-full px-4 py-3 bg-adm-surface flex items-center justify-between text-xs font-semibold text-adm-fg hover:bg-adm-fg/5"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Newsletter Section
                    </span>
                    {openSections.newsletter ? <ChevronDown className="w-4 h-4 text-adm-fg/50" /> : <ChevronRight className="w-4 h-4 text-adm-fg/50" />}
                  </button>
                  {openSections.newsletter && (
                    <div className="p-4 space-y-3 text-xs">
                      <div>
                        <label className="block text-adm-fg/70 mb-1">Newsletter Title</label>
                        <input
                          type="text"
                          value={draftData.home?.newsletterHeading || ''}
                          onChange={(e) => handleInputChange('home', 'newsletterHeading', e.target.value)}
                          className="w-full px-3 py-2 bg-adm-surface border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-adm-fg/70 mb-1">Newsletter Subtitle</label>
                        <input
                          type="text"
                          value={draftData.home?.newsletterSub || ''}
                          onChange={(e) => handleInputChange('home', 'newsletterSub', e.target.value)}
                          className="w-full px-3 py-2 bg-adm-surface border border-adm-border rounded-xl text-adm-fg focus:border-adm-accent focus:ring-2 focus:ring-adm-accent/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. ABOUT PAGE CONTROLS */}
            {activePage === 'about' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-adm-fg/70 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={draftData.about?.heroTitle || ''}
                    onChange={(e) => handleInputChange('about', 'heroTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={draftData.about?.heroSubtitle || ''}
                    onChange={(e) => handleInputChange('about', 'heroSubtitle', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Philosophy Heading</label>
                  <input
                    type="text"
                    value={draftData.about?.philosophyTitle || ''}
                    onChange={(e) => handleInputChange('about', 'philosophyTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Philosophy Description</label>
                  <textarea
                    rows={4}
                    value={draftData.about?.philosophyDesc || ''}
                    onChange={(e) => handleInputChange('about', 'philosophyDesc', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
              </div>
            )}

            {/* 3. SERVICES PAGE CONTROLS */}
            {activePage === 'services' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-adm-fg/70 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={draftData.services?.heroTitle || ''}
                    onChange={(e) => handleInputChange('services', 'heroTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">FAQ Section Heading</label>
                  <input
                    type="text"
                    value={draftData.services?.faqHeading || ''}
                    onChange={(e) => handleInputChange('services', 'faqHeading', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
              </div>
            )}

            {/* 4. SOURCING PAGE CONTROLS */}
            {activePage === 'sourcing' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-adm-fg/70 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={draftData.sourcing?.heroTitle || ''}
                    onChange={(e) => handleInputChange('sourcing', 'heroTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Network Title</label>
                  <input
                    type="text"
                    value={draftData.sourcing?.networkTitle || ''}
                    onChange={(e) => handleInputChange('sourcing', 'networkTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
              </div>
            )}

            {/* 5. CONTACT PAGE CONTROLS */}
            {activePage === 'contact' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-adm-fg/70 mb-1">Showroom Address</label>
                  <input
                    type="text"
                    value={draftData.contact?.address || ''}
                    onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={draftData.contact?.phone || ''}
                    onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={draftData.contact?.email || ''}
                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
              </div>
            )}

            {/* 6. FOOTER & GLOBAL CONTROLS */}
            {activePage === 'footer' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-adm-fg/70 mb-1">Top Announcement Bar</label>
                  <input
                    type="text"
                    value={draftData.footer?.announcement || ''}
                    onChange={(e) => handleInputChange('footer', 'announcement', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={draftData.footer?.brandName || ''}
                    onChange={(e) => handleInputChange('footer', 'brandName', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
                <div>
                  <label className="block text-adm-fg/70 mb-1">Copyright Notice</label>
                  <input
                    type="text"
                    value={draftData.footer?.copyright || ''}
                    onChange={(e) => handleInputChange('footer', 'copyright', e.target.value)}
                    className="w-full px-3 py-2 bg-adm-surface2 border border-adm-border rounded-xl text-adm-fg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Live Preview Window - 8 cols */}
          <div className="lg:col-span-8 bg-adm-surface2 border border-adm-border rounded-2xl overflow-hidden flex flex-col relative">
            <LiveSitePreviewCanvas activePage={activePage} viewport={viewport} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPageContent;
