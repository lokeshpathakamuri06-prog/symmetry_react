// Default banners, collections and CMS page copy (also used to seed the database)

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
    heroTitle: 'Where Vision Meets Timeless Design',
    heroSubtitle: 'Global sourcing, bespoke interiors, and end-to-end execution for spaces that inspire and endure.',
    heroCtaText: 'Explore Our Work',
    heroCtaSecondary: 'Start Your Project',
    categoriesHeading: 'Curated Categories',
    categoriesSub: 'Handcrafted furniture, stone architectural elements, and bespoke lighting.',
    featuredHeading: 'Spaces We’ve Brought to Life',
    featuredSub: 'Explore our residential, hospitality, commercial, healthcare, and bespoke interior projects.',
    brandStoryHeading: 'Built on Legacy. Designed for Modern Living.',
    brandStorySub: 'Symmetry Interiors combines international sourcing, thoughtful planning, quality materials, and skilled craftsmanship to create distinctive interiors.',
    brandStoryText: 'Symmetry Interiors & Building Solutions Private Limited is an interior design and furniture solutions company with over 25 years of sourcing expertise. We create elegant, functional, and timeless spaces through global sourcing, thoughtful design, premium materials, and professional execution. From homes and offices to hotels, hospitals, clubs, and commercial spaces, we provide complete interior solutions from concept to completion.',
    brandMessageTitle: 'Your Space. Our Expertise.',
    brandMessageSub: 'From globally sourced furniture to complete interior execution, we create spaces designed around your vision.',
    brandMessageBar: '25+ Years of Expertise | Global Sourcing | Bespoke Interiors | End-to-End Execution',
    newsletterHeading: 'Join the Private Circle',
    newsletterSub: 'Receive exclusive invitations to private collection debuts and architectural material catalogues.'
  },
  about: {
    heroTitle: 'Built on Legacy. Designed for Modern Living.',
    heroSubtitle: 'Symmetry Interiors combines international sourcing, thoughtful planning, quality materials, and skilled craftsmanship to create distinctive interiors.',
    companyOverview: 'Symmetry Interiors & Building Solutions Private Limited is an interior design and furniture solutions company with over 25 years of sourcing expertise. We create elegant, functional, and timeless spaces through global sourcing, thoughtful design, premium materials, and professional execution. From homes and offices to hotels, hospitals, clubs, and commercial spaces, we provide complete interior solutions from concept to completion.',
    mission: 'To create functional, beautifully furnished spaces that combine quality, craftsmanship, and timeless design while delivering a seamless experience for every client.',
    vision: 'To be a trusted name in interior design and furniture solutions by combining global design, innovative thinking, and exceptional craftsmanship.',
    ctaHeading: 'Let’s Create Your Space',
    ctaSub: 'Schedule a private consultation with our principal design directors.'
  },
  services: {
    heroTitle: 'End-to-End Architectural & Interior Solutions',
    heroSubtitle: 'Interior Design & Planning, Turnkey Solutions, Global Sourcing, Bespoke Furniture, Execution & Styling.',
    faqHeading: 'Frequently Asked Questions',
    faqSub: 'Everything you need to know about our turnkey execution, sourcing, and warranties.'
  },
  sourcing: {
    heroTitle: 'Global Material & Furniture Sourcing',
    heroSubtitle: '25+ Years of Sourcing Expertise. Direct access to leading international design destinations.',
    networkTitle: 'Leading Global Sourcing Hubs',
    networkDesc: 'Direct allocations across Italy, China, Malaysia, Vietnam, and Bali.'
  },
  contact: {
    heroTitle: 'Let’s Create Your Space',
    heroSubtitle: 'Connect with our design atelier or visit our main office in Ameerpet, Hyderabad.',
    companyName: 'Symmetry Interiors & Building Solutions Private Limited',
    officeAddress: 'Ground Floor, Surekha Chambers, Dharam Karan Road, Ameerpet, Hyderabad, Telangana – 500016',
    registeredOffice: 'Plot No. 65, Seva Mandal Shantiniketan Colony, M. Hills, Secunderabad, Hyderabad, Telangana – 500026, India.',
    cin: 'CIN: U51909TG2017PTC115299',
    phone: '+91 98765 43210 / +91 (040) 2355 8899',
    email: 'concierge@symmetryinteriors.com',
    hours: 'Monday - Saturday: 10:00 AM - 7:30 PM'
  },
  footer: {
    brandName: 'Symmetry Interiors',
    legalName: 'Symmetry Interiors & Building Solutions Private Limited',
    tagline: 'Your Space. Our Expertise.',
    subTagline: '25+ Years of Expertise | Global Sourcing | Bespoke Interiors | End-to-End Execution',
    officeAddress: 'Ground Floor, Surekha Chambers, Dharam Karan Road, Ameerpet, Hyderabad, Telangana – 500016',
    registeredOffice: 'Plot No. 65, Seva Mandal Shantiniketan Colony, M. Hills, Secunderabad, Hyderabad, Telangana – 500026, India.',
    cin: 'CIN: U51909TG2017PTC115299',
    copyright: '© 2026 Symmetry Interiors & Building Solutions Private Limited. All rights reserved.',
    instagram: 'https://www.instagram.com/symmetryinteriors.ltd/?hl=en',
    pinterest: 'https://pinterest.com',
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com'
  }
};
