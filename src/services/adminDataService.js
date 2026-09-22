import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Static Data Imports for Default Seeding / Fallback
import { products as initialProducts } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { blogs as initialBlogs } from '../data/blogs';
import { projects as initialProjects } from '../data/projects';
import { testimonials as initialTestimonials } from '../data/testimonials';
import { teamMembers as initialTeam } from '../data/aboutData';
import { services as initialServices } from '../data/services';

// Initial Banners
export const initialBanners = [
  {
    id: 'ban-1',
    title: 'Architectural Harmony & Bespoke Luxury',
    subtitle: 'Curated interior spaces, rare stones, and fine Milanese furniture engineered for enduring elegance.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    badge: 'Fall Collection 2026',
    cta_text: 'Explore Catalogue',
    cta_link: '/shop',
    display_order: 1,
    active: true
  },
  {
    id: 'ban-2',
    title: 'Monolithic Stone & Tailored Millwork',
    subtitle: 'Direct quarry allocations in Carrara & Verona executed with German CNC micro-tolerances.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    badge: 'Material Mastery',
    cta_text: 'View Projects',
    cta_link: '/projects',
    display_order: 2,
    active: true
  }
];

// Initial Collections
export const initialCollections = [
  {
    id: 'col-1',
    title: 'Milano Marble & Travertine Series',
    slug: 'milano-series',
    subtitle: 'Hand-selected travertine and Nero Marquina statement furniture',
    description: 'Bespoke living room tables and monolithic consoles carved from single stone blocks.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    product_ids: ['prod-1', 'prod-2']
  },
  {
    id: 'col-2',
    title: 'Nordic Oak & Saddle Leather',
    slug: 'nordic-leather',
    subtitle: 'Warm minimalist seating and handcrafted joinery',
    description: 'Solid FSC-certified European oak paired with vegetable-tanned Italian leathers.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    product_ids: ['prod-3', 'prod-4']
  }
];

// Initial Default Site Sections (CMS Content)
export const defaultSiteContent = {
  home: {
    heroTitle: 'Architectural Harmony & Bespoke Interiors',
    heroSubtitle: 'Redefining luxury living through monolithic stone, precision joinery, and direct global material allocations.',
    heroCtaText: 'Explore Catalog',
    categoriesHeading: 'Curated Categories',
    categoriesSub: 'Handcrafted furniture, stone architectural elements, and bespoke lighting.',
    featuredHeading: 'Signature Creations',
    featuredSub: 'Masterpieces designed for private residences, penthouses, and executive estates.',
    brandStoryHeading: '25+ Years of Provenance & Material Mastery',
    brandStorySub: 'We operate our own 25,000 sq.ft. high-precision fabrication unit with direct quarry access in Verona, Milan, and Bali.',
    brandStoryText: 'Founded in 1999, Symmetry bridges the gap between visionary architecture and flawless turnkey execution.',
    newsletterHeading: 'Join the Private Circle',
    newsletterSub: 'Receive exclusive invitations to private collection debuts and architectural material catalogues.'
  },
  about: {
    heroTitle: 'Our Provenance & Spatial Philosophy',
    heroSubtitle: 'Quarter-century of structural honesty, zero-defect execution, and direct global quarry partnerships.',
    philosophyTitle: 'The Principles of Permanent Elegance',
    philosophyDesc: 'We believe architecture is not merely about decorating empty rooms; it is the choreography of light, volume, acoustic serenity, and tactile stone.',
    ctaHeading: 'Ready to Transform Your Architectural Vision?',
    ctaSub: 'Schedule a private consultation with our principal architects and material directors.'
  },
  services: {
    heroTitle: 'End-to-End Architectural & Turnkey Execution',
    heroSubtitle: 'From conceptual spatial master planning to 0.5mm precision millwork installation.',
    faqHeading: 'Frequently Asked Questions',
    faqSub: 'Everything you need to know about our turnkey execution, sourcing, and warranties.'
  },
  sourcing: {
    heroTitle: 'Global Material & Furniture Sourcing',
    heroSubtitle: 'Bypassing brokers to bring direct quarry travertine, Italian hides, and Milanese ateliers to your doorstep.',
    networkTitle: '14 International Sourcing Hubs',
    networkDesc: 'Direct allocations across Carrara, Verona, Bali, Foshan, and High Point.'
  },
  contact: {
    heroTitle: 'Connect With Our Design Atelier',
    heroSubtitle: 'Visit our Hyderabad Experience Center or request a private estate consultation.',
    address: 'Symmetry Design Tower, Suite 400, Road No. 36, Jubilee Hills, Hyderabad - 500033',
    phone: '+91 (040) 4859 9000',
    email: 'concierge@symmetryinteriors.com',
    hours: 'Monday - Saturday: 10:00 AM - 7:30 PM (By Appointment Only)'
  },
  footer: {
    brandName: 'SYMMETRY',
    tagline: 'Architectural Interiors & Global Material Sourcing',
    announcement: '✨ Complimentary Private Consultation for 5,000+ Sq.Ft. Estates — Book Now',
    copyright: '© 2026 Symmetry Interiors Ltd. All rights reserved.',
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com'
  }
};

// INITIAL MOCK ORDERS
export const initialOrders = [
  {
    id: 'ord-1001',
    order_number: 'SYM-89421',
    customer_name: 'Vikramaditya Sharma',
    customer_email: 'vikram.sharma@example.com',
    customer_phone: '+91 98765 43210',
    total: 345000,
    status: 'processing',
    items: [
      { id: 'prod-1', name: 'Milano Travertine Coffee Table', price: 220000, quantity: 1 },
      { id: 'prod-3', name: 'Nordic Oak Lounge Chair', price: 125000, quantity: 1 }
    ],
    shipping_address: {
      address: 'Plot 42, Jubilee Hills Phase 3',
      city: 'Hyderabad',
      state: 'Telangana',
      zip: '500033'
    },
    payment_method: 'Card',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'ord-1002',
    order_number: 'SYM-89422',
    customer_name: 'Priya Sundaram',
    customer_email: 'priya.s@example.com',
    customer_phone: '+91 99887 76655',
    total: 180000,
    status: 'shipped',
    items: [
      { id: 'prod-2', name: 'Nero Marquina Console', price: 180000, quantity: 1 }
    ],
    shipping_address: {
      address: 'Tower B, Apartment 1402, Financial District',
      city: 'Hyderabad',
      state: 'Telangana',
      zip: '500032'
    },
    payment_method: 'UPI',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// INITIAL MOCK INQUIRIES
export const initialInquiries = [
  {
    id: 'inq-1',
    name: 'Rajesh Malhotra',
    email: 'rmalhotra@investcorp.com',
    phone: '+91 98111 22334',
    service: 'Turnkey Residential Interior',
    message: 'Looking to execute interior work for a 12,000 sq.ft. villa in Jubilee Hills. Need full travertine bookmatching and Milanese furniture sourcing.',
    status: 'unread',
    notes: '',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'inq-2',
    name: 'Dr. Sneha Reddy',
    email: 'dr.sneha@clinicart.in',
    phone: '+91 94400 55667',
    service: 'Bespoke Furniture Sourcing',
    message: 'Requesting catalog and price quote for executive office desk and ergonomic leather seating.',
    status: 'read',
    notes: 'Sent catalog pdf via email on Friday',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

// INITIAL MEDIA ASSETS
export const initialMedia = [
  {
    id: 'med-1',
    name: 'travertine_living_room.jpg',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    size_bytes: 2450000,
    mime_type: 'image/jpeg',
    created_at: new Date().toISOString()
  },
  {
    id: 'med-2',
    name: 'nero_marquina_console.jpg',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    size_bytes: 1890000,
    mime_type: 'image/jpeg',
    created_at: new Date().toISOString()
  }
];

// Local Storage Helper Utilities
const getStorageItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

// MASTER DATA SERVICE CLASS
class AdminDataService {
  constructor() {
    this.initLocalStorage();
  }

  initLocalStorage() {
    if (!localStorage.getItem('symmetry_products')) setStorageItem('symmetry_products', initialProducts);
    if (!localStorage.getItem('symmetry_categories')) setStorageItem('symmetry_categories', initialCategories);
    if (!localStorage.getItem('symmetry_blogs')) setStorageItem('symmetry_blogs', initialBlogs);
    if (!localStorage.getItem('symmetry_projects')) setStorageItem('symmetry_projects', initialProjects);
    if (!localStorage.getItem('symmetry_testimonials')) setStorageItem('symmetry_testimonials', initialTestimonials);
    if (!localStorage.getItem('symmetry_team')) setStorageItem('symmetry_team', initialTeam);
    if (!localStorage.getItem('symmetry_banners')) setStorageItem('symmetry_banners', initialBanners);
    if (!localStorage.getItem('symmetry_collections')) setStorageItem('symmetry_collections', initialCollections);
    if (!localStorage.getItem('symmetry_orders')) setStorageItem('symmetry_orders', initialOrders);
    if (!localStorage.getItem('symmetry_inquiries')) setStorageItem('symmetry_inquiries', initialInquiries);
    if (!localStorage.getItem('symmetry_media')) setStorageItem('symmetry_media', initialMedia);
    if (!localStorage.getItem('symmetry_site_content')) setStorageItem('symmetry_site_content', defaultSiteContent);
  }

  // -------------------------------------------------------------
  // 1. SITE CONTENT & CMS SECTIONS
  // -------------------------------------------------------------
  async getSiteContent() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('site_sections').select('*');
      if (!error && data && data.length > 0) {
        const contentObj = { ...defaultSiteContent };
        data.forEach(item => {
          if (contentObj[item.page]) {
            contentObj[item.page] = { ...contentObj[item.page], ...item.content };
          }
        });
        return contentObj;
      }
    }
    return getStorageItem('symmetry_site_content', defaultSiteContent);
  }

  async updateSiteContent(page, contentPartial) {
    const current = getStorageItem('symmetry_site_content', defaultSiteContent);
    const updatedPage = { ...(current[page] || {}), ...contentPartial };
    const newContent = { ...current, [page]: updatedPage };
    setStorageItem('symmetry_site_content', newContent);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('site_sections').upsert({
        page,
        section_key: `${page}_main`,
        content: updatedPage,
        updated_at: new Date().toISOString()
      }, { onConflict: 'section_key' });
    }

    return newContent;
  }

  // -------------------------------------------------------------
  // 2. HOMEPAGE BANNERS
  // -------------------------------------------------------------
  async getBanners() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('banners').select('*').order('display_order', { ascending: true });
      if (!error && data) return data;
    }
    return getStorageItem('symmetry_banners', initialBanners);
  }

  async saveBanner(banner) {
    const banners = getStorageItem('symmetry_banners', initialBanners);
    const index = banners.findIndex(b => b.id === banner.id);
    let updated;
    if (index >= 0) {
      banners[index] = { ...banners[index], ...banner };
      updated = banners;
    } else {
      const newBanner = { ...banner, id: banner.id || `ban-${Date.now()}` };
      updated = [newBanner, ...banners];
    }
    setStorageItem('symmetry_banners', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('banners').upsert(banner);
    }
    return updated;
  }

  async deleteBanner(id) {
    const banners = getStorageItem('symmetry_banners', initialBanners).filter(b => b.id !== id);
    setStorageItem('symmetry_banners', banners);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('banners').delete().eq('id', id);
    }
    return banners;
  }

  // -------------------------------------------------------------
  // 3. PRODUCTS
  // -------------------------------------------------------------
  async getProducts() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return getStorageItem('symmetry_products', initialProducts);
  }

  async saveProduct(product) {
    const products = getStorageItem('symmetry_products', initialProducts);
    const index = products.findIndex(p => p.id === product.id);
    let updated;
    if (index >= 0) {
      products[index] = { ...products[index], ...product, updated_at: new Date().toISOString() };
      updated = products;
    } else {
      const newProd = {
        ...product,
        id: product.id || `prod-${Date.now()}`,
        in_stock: product.in_stock !== undefined ? product.in_stock : true,
        created_at: new Date().toISOString()
      };
      updated = [newProd, ...products];
    }
    setStorageItem('symmetry_products', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').upsert(product);
    }
    return updated;
  }

  async deleteProduct(id) {
    const products = getStorageItem('symmetry_products', initialProducts).filter(p => p.id !== id);
    setStorageItem('symmetry_products', products);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
    return products;
  }

  async toggleProductStock(id) {
    const products = getStorageItem('symmetry_products', initialProducts);
    const updated = products.map(p => p.id === id ? { ...p, in_stock: !p.in_stock } : p);
    setStorageItem('symmetry_products', updated);

    if (isSupabaseConfigured && supabase) {
      const prod = updated.find(p => p.id === id);
      if (prod) await supabase.from('products').update({ in_stock: prod.in_stock }).eq('id', id);
    }
    return updated;
  }

  // -------------------------------------------------------------
  // 4. CATEGORIES
  // -------------------------------------------------------------
  async getCategories() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return getStorageItem('symmetry_categories', initialCategories);
  }

  async saveCategory(category) {
    const categories = getStorageItem('symmetry_categories', initialCategories);
    const index = categories.findIndex(c => c.id === category.id || c.slug === category.slug);
    let updated;
    if (index >= 0) {
      categories[index] = { ...categories[index], ...category };
      updated = categories;
    } else {
      const newCat = { ...category, id: category.id || category.slug || `cat-${Date.now()}` };
      updated = [...categories, newCat];
    }
    setStorageItem('symmetry_categories', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').upsert(category);
    }
    return updated;
  }

  async deleteCategory(id) {
    const categories = getStorageItem('symmetry_categories', initialCategories).filter(c => c.id !== id);
    setStorageItem('symmetry_categories', categories);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').delete().eq('id', id);
    }
    return categories;
  }

  // -------------------------------------------------------------
  // 5. COLLECTIONS
  // -------------------------------------------------------------
  async getCollections() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('collections').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return getStorageItem('symmetry_collections', initialCollections);
  }

  async saveCollection(collection) {
    const collections = getStorageItem('symmetry_collections', initialCollections);
    const index = collections.findIndex(c => c.id === collection.id);
    let updated;
    if (index >= 0) {
      collections[index] = { ...collections[index], ...collection };
      updated = collections;
    } else {
      const newCol = { ...collection, id: collection.id || `col-${Date.now()}` };
      updated = [newCol, ...collections];
    }
    setStorageItem('symmetry_collections', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('collections').upsert(collection);
    }
    return updated;
  }

  async deleteCollection(id) {
    const collections = getStorageItem('symmetry_collections', initialCollections).filter(c => c.id !== id);
    setStorageItem('symmetry_collections', collections);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('collections').delete().eq('id', id);
    }
    return collections;
  }

  // -------------------------------------------------------------
  // 6. PROJECTS (PORTFOLIO)
  // -------------------------------------------------------------
  async getProjects() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return getStorageItem('symmetry_projects', initialProjects);
  }

  async saveProject(project) {
    const projects = getStorageItem('symmetry_projects', initialProjects);
    const index = projects.findIndex(p => p.id === project.id);
    let updated;
    if (index >= 0) {
      projects[index] = { ...projects[index], ...project };
      updated = projects;
    } else {
      const newProj = { ...project, id: project.id || `proj-${Date.now()}` };
      updated = [newProj, ...projects];
    }
    setStorageItem('symmetry_projects', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('projects').upsert(project);
    }
    return updated;
  }

  async deleteProject(id) {
    const projects = getStorageItem('symmetry_projects', initialProjects).filter(p => p.id !== id);
    setStorageItem('symmetry_projects', projects);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('projects').delete().eq('id', id);
    }
    return projects;
  }

  // -------------------------------------------------------------
  // 7. BLOGS / JOURNAL
  // -------------------------------------------------------------
  async getBlogs() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('blogs').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return getStorageItem('symmetry_blogs', initialBlogs);
  }

  async saveBlog(blog) {
    const blogs = getStorageItem('symmetry_blogs', initialBlogs);
    const index = blogs.findIndex(b => b.id === blog.id);
    let updated;
    if (index >= 0) {
      blogs[index] = { ...blogs[index], ...blog };
      updated = blogs;
    } else {
      const newBlog = {
        ...blog,
        id: blog.id || `blog-${Date.now()}`,
        date: blog.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      updated = [newBlog, ...blogs];
    }
    setStorageItem('symmetry_blogs', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('blogs').upsert(blog);
    }
    return updated;
  }

  async deleteBlog(id) {
    const blogs = getStorageItem('symmetry_blogs', initialBlogs).filter(b => b.id !== id);
    setStorageItem('symmetry_blogs', blogs);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('blogs').delete().eq('id', id);
    }
    return blogs;
  }

  // -------------------------------------------------------------
  // 8. TESTIMONIALS
  // -------------------------------------------------------------
  async getTestimonials() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return getStorageItem('symmetry_testimonials', initialTestimonials);
  }

  async saveTestimonial(testimonial) {
    const testimonials = getStorageItem('symmetry_testimonials', initialTestimonials);
    const index = testimonials.findIndex(t => t.id === testimonial.id);
    let updated;
    if (index >= 0) {
      testimonials[index] = { ...testimonials[index], ...testimonial };
      updated = testimonials;
    } else {
      const newTest = { ...testimonial, id: testimonial.id || `test-${Date.now()}` };
      updated = [newTest, ...testimonials];
    }
    setStorageItem('symmetry_testimonials', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('testimonials').upsert(testimonial);
    }
    return updated;
  }

  async deleteTestimonial(id) {
    const testimonials = getStorageItem('symmetry_testimonials', initialTestimonials).filter(t => t.id !== id);
    setStorageItem('symmetry_testimonials', testimonials);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('testimonials').delete().eq('id', id);
    }
    return testimonials;
  }

  // -------------------------------------------------------------
  // 9. TEAM MEMBERS
  // -------------------------------------------------------------
  async getTeam() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('team_members').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return getStorageItem('symmetry_team', initialTeam);
  }

  async saveTeamMember(member) {
    const team = getStorageItem('symmetry_team', initialTeam);
    const index = team.findIndex(t => t.id === member.id);
    let updated;
    if (index >= 0) {
      team[index] = { ...team[index], ...member };
      updated = team;
    } else {
      const newMem = { ...member, id: member.id || `team-${Date.now()}` };
      updated = [...team, newMem];
    }
    setStorageItem('symmetry_team', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('team_members').upsert(member);
    }
    return updated;
  }

  async deleteTeamMember(id) {
    const team = getStorageItem('symmetry_team', initialTeam).filter(t => t.id !== id);
    setStorageItem('symmetry_team', team);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('team_members').delete().eq('id', id);
    }
    return team;
  }

  // -------------------------------------------------------------
  // 10. CONTACT FORM INQUIRIES
  // -------------------------------------------------------------
  async getInquiries() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getStorageItem('symmetry_inquiries', initialInquiries);
  }

  async submitInquiry(inquiry) {
    const inquiries = getStorageItem('symmetry_inquiries', initialInquiries);
    const newInq = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'unread',
      created_at: new Date().toISOString()
    };
    const updated = [newInq, ...inquiries];
    setStorageItem('symmetry_inquiries', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('inquiries').insert(newInq);
    }
    return newInq;
  }

  async updateInquiryStatus(id, status, notes = '') {
    const inquiries = getStorageItem('symmetry_inquiries', initialInquiries);
    const updated = inquiries.map(i => i.id === id ? { ...i, status, notes } : i);
    setStorageItem('symmetry_inquiries', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('inquiries').update({ status, notes }).eq('id', id);
    }
    return updated;
  }

  async deleteInquiry(id) {
    const inquiries = getStorageItem('symmetry_inquiries', initialInquiries).filter(i => i.id !== id);
    setStorageItem('symmetry_inquiries', inquiries);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('inquiries').delete().eq('id', id);
    }
    return inquiries;
  }

  // -------------------------------------------------------------
  // 11. ORDERS
  // -------------------------------------------------------------
  async getOrders() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getStorageItem('symmetry_orders', initialOrders);
  }

  async createOrder(orderData) {
    const orders = getStorageItem('symmetry_orders', initialOrders);
    const newOrd = {
      ...orderData,
      id: orderData.id || `ord-${Date.now()}`,
      order_number: orderData.order_number || `SYM-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    const updated = [newOrd, ...orders];
    setStorageItem('symmetry_orders', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').insert(newOrd);
    }
    return newOrd;
  }

  async updateOrderStatus(id, status) {
    const orders = getStorageItem('symmetry_orders', initialOrders);
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setStorageItem('symmetry_orders', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').update({ status }).eq('id', id);
    }
    return updated;
  }

  async deleteOrder(id) {
    const orders = getStorageItem('symmetry_orders', initialOrders).filter(o => o.id !== id);
    setStorageItem('symmetry_orders', orders);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').delete().eq('id', id);
    }
    return orders;
  }

  // -------------------------------------------------------------
  // 12. MEDIA LIBRARY
  // -------------------------------------------------------------
  async getMedia() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getStorageItem('symmetry_media', initialMedia);
  }

  async addMediaAsset(fileOrUrl, fileName = 'uploaded_image.jpg') {
    const mediaList = getStorageItem('symmetry_media', initialMedia);
    let url = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);
    
    // If Supabase Storage is configured, try uploading
    if (isSupabaseConfigured && supabase && typeof fileOrUrl !== 'string') {
      try {
        const fileExt = fileOrUrl.name.split('.').pop();
        const filePath = `uploads/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(filePath, fileOrUrl);
        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
          if (publicUrlData?.publicUrl) url = publicUrlData.publicUrl;
        }
      } catch (e) {
        console.warn('Supabase storage upload fallback to local URL preview:', e);
      }
    }

    const newAsset = {
      id: `med-${Date.now()}`,
      name: fileName || fileOrUrl.name || 'image_asset.jpg',
      url,
      size_bytes: fileOrUrl.size || 1500000,
      mime_type: fileOrUrl.type || 'image/jpeg',
      created_at: new Date().toISOString()
    };

    const updated = [newAsset, ...mediaList];
    setStorageItem('symmetry_media', updated);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('media_assets').insert(newAsset);
    }
    return updated;
  }

  async deleteMedia(id) {
    const mediaList = getStorageItem('symmetry_media', initialMedia).filter(m => m.id !== id);
    setStorageItem('symmetry_media', mediaList);

    if (isSupabaseConfigured && supabase) {
      await supabase.from('media_assets').delete().eq('id', id);
    }
    return mediaList;
  }

  // -------------------------------------------------------------
  // 13. SEED SUPABASE DATABASE (1-Click Tool)
  // -------------------------------------------------------------
  async seedSupabaseDatabase() {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env' };
    }

    try {
      // Upsert products
      await supabase.from('products').upsert(initialProducts);
      // Upsert categories
      await supabase.from('categories').upsert(initialCategories);
      // Upsert blogs
      await supabase.from('blogs').upsert(initialBlogs);
      // Upsert projects
      await supabase.from('projects').upsert(initialProjects);
      // Upsert testimonials
      await supabase.from('testimonials').upsert(initialTestimonials);
      // Upsert team
      await supabase.from('team_members').upsert(initialTeam);
      // Upsert banners
      await supabase.from('banners').upsert(initialBanners);
      // Upsert collections
      await supabase.from('collections').upsert(initialCollections);
      // Upsert site content
      await supabase.from('site_sections').upsert(
        Object.entries(defaultSiteContent).map(([page, content]) => ({
          page,
          section_key: `${page}_main`,
          content,
          updated_at: new Date().toISOString()
        }))
      );

      return { success: true, message: 'Successfully seeded all 12 modules into your Supabase database!' };
    } catch (err) {
      console.error('Supabase seeding error:', err);
      return { success: false, message: `Seeding error: ${err.message}` };
    }
  }
}

export const adminDataService = new AdminDataService();
export default adminDataService;
