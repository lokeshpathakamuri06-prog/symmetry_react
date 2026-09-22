import React, { createContext, useContext, useState, useEffect } from 'react';
import adminDataService, { defaultSiteContent } from '../services/adminDataService';

const SiteContentContext = createContext();

export const SiteContentProvider = ({ children }) => {
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [draftContent, setDraftContent] = useState(null);
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        contentData,
        bannersData,
        productsData,
        categoriesData,
        collectionsData,
        projectsData,
        blogsData,
        testimonialsData,
        teamData
      ] = await Promise.all([
        adminDataService.getSiteContent(),
        adminDataService.getBanners(),
        adminDataService.getProducts(),
        adminDataService.getCategories(),
        adminDataService.getCollections(),
        adminDataService.getProjects(),
        adminDataService.getBlogs(),
        adminDataService.getTestimonials(),
        adminDataService.getTeam()
      ]);

      const activeContent = contentData || defaultSiteContent;
      setSiteContent(activeContent);
      setBanners(bannersData || []);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setCollections(collectionsData || []);
      setProjects(projectsData || []);
      setBlogs(blogsData || []);
      setTestimonials(testimonialsData || []);
      setTeam(teamData || []);
    } catch (err) {
      console.error('Error loading site content context:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const refreshSiteContent = async () => {
    await loadAllData();
  };

  const updatePageContent = async (page, partialContent) => {
    const updated = await adminDataService.updateSiteContent(page, partialContent);
    setSiteContent(updated);
    setDraftContent(null);
  };

  // Content for public pages (prefers draft if active, else published content)
  const activeContent = draftContent || siteContent;

  return (
    <SiteContentContext.Provider
      value={{
        siteContent: activeContent,
        publishedContent: siteContent,
        draftContent,
        setDraftContent,
        banners,
        products,
        categories,
        collections,
        projects,
        blogs,
        testimonials,
        team,
        loading,
        refreshSiteContent,
        updatePageContent
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};

export default SiteContentContext;
