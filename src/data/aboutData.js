import { 
  Building2, 
  ShieldCheck, 
  Globe2, 
  Cpu, 
  Clock, 
  Award,
  Gem
} from 'lucide-react';

// Official Company Details
export const companyDetails = {
  name: 'Symmetry Interiors & Building Solutions Private Limited',
  overview: 'Symmetry Interiors & Building Solutions Private Limited is an interior design and furniture solutions company with over 25 years of sourcing expertise. We create elegant, functional, and timeless spaces through global sourcing, thoughtful design, premium materials, and professional execution. From homes and offices to hotels, hospitals, clubs, and commercial spaces, we provide complete interior solutions from concept to completion.',
  officeAddress: 'Ground Floor, Surekha Chambers, Dharam Karan Road, Ameerpet, Hyderabad, Telangana – 500016',
  registeredOffice: 'Plot No. 65, Seva Mandal Shantiniketan Colony, M. Hills, Secunderabad, Hyderabad, Telangana – 500026, India.',
  cin: 'CIN: U51909TG2017PTC115299',
  heroTagline: 'Where Vision Meets Timeless Design',
  heroSub: 'Global sourcing, bespoke interiors, and end-to-end execution for spaces that inspire and endure.',
  brandMessageTitle: 'Your Space. Our Expertise.',
  brandMessageSub: 'From globally sourced furniture to complete interior execution, we create spaces designed around your vision.',
  brandMessagePillars: '25+ Years of Expertise | Global Sourcing | Bespoke Interiors | End-to-End Execution'
};

// Hero Stats
export const heroStats = [
  { value: '25+', label: 'Years of Expertise', sub: 'Proven Industry Legacy' },
  { value: 'Global', label: 'Sourcing Destinations', sub: 'Italy, Asia & Beyond' },
  { value: 'End-to-End', label: 'Turnkey Solutions', sub: 'Concept to Installation' },
  { value: 'Bespoke', label: 'Design & Craftsmanship', sub: 'Tailored to Each Client' },
];

// 3. Legacy & Experience Visual Timeline
export const timelineMilestones = [
  {
    year: '1999',
    phase: 'Foundation',
    title: 'The Inception of Symmetry',
    subtitle: 'From Architectural Consultancy to Material Mastery',
    desc: 'Founded by Vikramaditya Rao after his tenure in London, Symmetry began as an architectural advisory collective dedicated to elevating high-end residential spaces in South Asia through uncompromised structural honesty.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    metric: '1st Heritage Estate Commission',
    location: 'Hyderabad, India',
  },
  {
    year: '2006',
    phase: 'Global Expansion',
    title: 'Direct International Quarry Partnerships',
    subtitle: 'Eliminating the Brokerage Layer',
    desc: 'Bypassing conventional stone brokers, Symmetry secured direct extraction rights and exclusive allocations with century-old marble quarries in Carrara and Verona, Italy, and FSC-certified teak reserves across Southeast Asia.',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1000&q=80',
    metric: '6 Global Sourcing Conduits',
    location: 'Verona & Milan, Italy',
  },
  {
    year: '2012',
    phase: 'Vertical Integration',
    title: '25,000 Sq.Ft. High-Precision Joinery Unit',
    subtitle: 'German 5-Axis CNC & Press Facilities',
    desc: 'To achieve 0.5mm shadow reveals and bookmatched veneer tolerances, we established our proprietary 25,000 sq.ft. industrial manufacturing and metal forging campus, housing 120+ master craftsmen.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    metric: '0.5mm Shadow Reveal Precision',
    location: 'Telangana Industrial Park',
  },
  {
    year: '2018',
    phase: 'Turnkey Excellence',
    title: 'Pioneering Integrated Architectural Acoustics & Automation',
    subtitle: 'Invisible Engineering for Ultra-Luxury Residences',
    desc: 'We merged structural civil execution with concealed smart-home telemetry, acoustic envelope isolation, and museum-grade lighting scenography, delivering fully turnkey palatial residences under single-point accountability.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
    metric: '180+ Turnkey Penthouses Delivered',
    location: 'Mumbai & Bengaluru',
  },
  {
    year: '2022',
    phase: 'Experiential Atelier',
    title: 'The Jubilee Hills Design Pavilion',
    subtitle: 'A Monolithic Curation Gallery',
    desc: 'Unveiling our signature experiential pavilion—a sanctuary where patrons, architects, and collectors touch monolithic travertine slabs, examine patinated bronze samples, and curate bespoke furnishings in private salon suites.',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
    metric: '1,200+ Rare Material Archives',
    location: 'Jubilee Hills, Hyderabad',
  },
  {
    year: 'Present',
    phase: 'Future Epoch',
    title: 'Enduring Spaces With Character',
    subtitle: 'Generational Permanence & Carbon-Conscious Luxury',
    desc: 'Today, Symmetry stands as South Asia’s benchmark in turnkey architectural interiors—blending twenty-five years of material provenance with forward-looking biophilic design, carbon-neutral kiln drying, and timeless elegance.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    metric: '450+ Completed Masterpieces',
    location: 'Global Footprint',
  },
];

// 4. 25+ Years of Global Sourcing Hubs
export const sourcingHubs = [
  {
    id: 'italy',
    country: 'Italy',
    city: 'Verona & Milan',
    flag: '🇮🇹',
    tag: 'Haute Marble & Tailored Leathers',
    desc: 'Quarter-century direct relationships with family-owned Carrara quarries and Brianza leather ateliers. Every block is hand-selected at the vein face before extraction.',
    materials: ['Roman Travertine', 'Calacatta Borghini', 'Full-Grain Saddle Hide', 'Murano Crystal'],
    experienceYears: '25 Years Direct',
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'china',
    country: 'China',
    city: 'Foshan & Shenzhen',
    flag: '🇨🇳',
    tag: '5-Axis CNC & Architectural Bronzes',
    desc: 'Direct tie-ups with leading aerospace-grade precision metal fabricators and curved architectural glass facilities, engineered to sub-millimeter tolerances.',
    materials: ['Anodized Architectural Bronzes', 'Curved Acoustic Glazing', 'Titanium PVD Finishes', 'Concealed Pivots'],
    experienceYears: '18 Years Direct',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'malaysia',
    country: 'Malaysia',
    city: 'Selangor & Penang',
    flag: '🇲🇾',
    tag: 'FSC-Certified Tropical Hardwoods',
    desc: 'Sustainable plantation teak and vacuum kiln-dried balau wood seasoned to withstand diverse climatic shifts without contraction or micro-fracturing.',
    materials: ['Kiln-Dried Golden Teak', 'Marine-Grade Joinery', 'Balau Structural Beams', 'Quarter-Sawn Veneers'],
    experienceYears: '21 Years Direct',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bali',
    country: 'Indonesia',
    city: 'Gianyar & Ubud',
    flag: '🇮🇩',
    tag: 'Monolithic Volcanic Stone & Reclaimed Roots',
    desc: 'Generational stonecutters carving volcanic basalt and sculptural teak root furnishings that bring raw, tactile soul to modern minimalist residences.',
    materials: ['Monolithic Basalt Sinks', 'Reclaimed Root Tables', 'Hand-Chiseled Andesite', 'Organic Lime Plaster'],
    experienceYears: '16 Years Direct',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'vietnam',
    country: 'Vietnam',
    city: 'Binh Duong & Da Nang',
    flag: '🇻🇳',
    tag: 'Artisanal Canework & Architectural Stoneware',
    desc: 'Heritage craft guilds producing micro-woven natural rattan panels, bespoke acoustic wall screens, and wood-fired high-temperature ceramic vessels.',
    materials: ['Tight Weave Natural Rattan', 'Acoustic Woven Screens', 'High-Fired Ceramic Urns', 'Water Hyacinth Weaves'],
    experienceYears: '14 Years Direct',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'germany',
    country: 'Germany & Austria',
    city: 'Baden-Württemberg & Vorarlberg',
    flag: '🇩🇪',
    tag: 'Engineered Kinetic Hardware & Bio-Lacquers',
    desc: 'Industrial-grade concealed hinges, silent magnetic dampeners, and ultra-low VOC natural plant-based hardwax oils ensuring mechanical perfection.',
    materials: ['Magnetic Soft-Close Systems', 'Zero-VOC Bio Lacquers', 'Heavy-Duty Concealed Slides', 'German Laser Edgebanding'],
    experienceYears: '22 Years Direct',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  },
];

// Sourcing Guarantees
export const sourcingGuarantees = [
  {
    title: 'Zero Broker Markups',
    desc: 'Direct factory and quarry billing eliminates intermediary markups of 35-50%, channeling every rupee into premium material substance.',
    icon: ShieldCheck,
  },
  {
    title: 'Atelier In-Person Vetting',
    desc: 'Our sourcing directors inspect every stone slab at the cutting wire and every timber log at the kiln before crating.',
    icon: Gem,
  },
  {
    title: 'Climate-Controlled Transit',
    desc: 'From port of origin to our Hyderabad fabrication unit, delicate veneers and stones travel in moisture-calibrated sea containers.',
    icon: Globe2,
  },
];

// 5 & 6. Mission & Vision Data
export const missionData = {
  eyebrow: 'Our Purpose & Commitment',
  title: 'Our Mission',
  lead: 'To create functional, beautifully furnished spaces that combine quality, craftsmanship, and timeless design while delivering a seamless experience for every client.',
  statement:
    'Symmetry Interiors combines international sourcing, thoughtful planning, quality materials, and skilled craftsmanship to create distinctive interiors across residential, hospitality, commercial, healthcare, and institutional projects.',
  pillars: [
    {
      title: 'Global Quality & Sourcing',
      desc: 'Delivering furniture and materials sourced from leading design destinations with uncompromised craftsmanship.',
    },
    {
      title: 'Bespoke Design',
      desc: 'Solutions tailored precisely to each client’s vision, functional requirements, and lifestyle.',
    },
    {
      title: 'End-to-End Solutions',
      desc: 'One single partner from initial concept, design, and sourcing to final execution and styling.',
    },
  ],
};

export const visionData = {
  eyebrow: 'The Horizon Ahead',
  title: 'Our Vision',
  lead: 'To be a trusted name in interior design and furniture solutions by combining global design, innovative thinking, and exceptional craftsmanship.',
  statement:
    'We create spaces designed around your vision — from globally sourced furniture to complete interior execution for residential, commercial, hospitality, healthcare, and institutional environments.',
  commitments: [
    {
      label: 'Proven Expertise',
      value: '25+ Years Experience',
    },
    {
      label: 'Sourcing Hubs',
      value: 'Global Design Destinations',
    },
    {
      label: 'Turnkey Delivery',
      value: 'Concept to Completion',
    },
  ],
};

// 7. Design Philosophy (The 6 Pillars of Symmetry)
export const designPhilosophy = [
  {
    num: '01',
    roman: 'I',
    title: 'Silence Over Noise',
    subtitle: 'Acoustic Serenity & Visual Restraint',
    desc: 'True luxury does not clamor for attention. We cultivate serene spaces where natural light, balanced proportions, and concealed acoustic treatments allow the mind to decompress.',
    materials: 'Fluted Acoustic Felt, Honed Travertine, Recessed Linear Reveals',
  },
  {
    num: '02',
    roman: 'II',
    title: 'Authentic Materiality',
    subtitle: 'Zero Synthetic Pretenses',
    desc: 'We strictly reject printed laminates, faux marbles, and synthetic wood substitutes. Every touchpoint utilizes raw Roman travertine, solid European hardwoods, and full-grain natural leather.',
    materials: 'Open-Pore Travertine, Smoked White Oak, Solid Cast Bronze',
  },
  {
    num: '03',
    roman: 'III',
    title: 'Millimeter Tolerances',
    subtitle: 'Architectural Joinery with Robotic Precision',
    desc: 'Mastery lies in the reveals. Our German 5-axis CNC machining, laser alignment, and hand-tuned fittings achieve continuous grain runs and tolerances within 0.5mm.',
    materials: 'German Laser Edgebanding, Concealed Magnetic Closures, 0.5mm Shadowlines',
  },
  {
    num: '04',
    roman: 'IV',
    title: 'Tectonic Harmony',
    subtitle: 'The Dialogue of Mass and Light',
    desc: 'Balancing monolithic anchor volumes—such as 12-foot hand-chiseled stone kitchen islands—with weightless floating cabinetry and gossamer daylight illumination.',
    materials: 'Cantilevered Volcanic Slabs, Low-Iron Fluted Glass, Warm 2700K Glow',
  },
  {
    num: '05',
    roman: 'V',
    title: 'Humanized Ergonomics',
    subtitle: 'Spaces Tailored to Human Rituals',
    desc: 'Architecture must embrace the bodies inhabiting it. Every countertop radius, handle grip, and bench contour is calibrated for intuitive, comforting tactile interaction.',
    materials: 'Bullnose Stone Edge Profiles, Saddle-Stitched Handrails, Soft-Action Drawers',
  },
  {
    num: '06',
    roman: 'VI',
    title: 'Enduring Continuity',
    subtitle: 'Surfaces That Age With Dignity',
    desc: 'Rather than degrading, our spaces develop a rich, storied patina over time. Unlacquered brass matures, full-grain leather softens, and natural timber deepens in tonal warmth.',
    materials: 'Living Brass Finishes, Vegetable-Tanned Hides, Wax-Finished Timbers',
  },
];

// 8. Team Data
export const teamMembers = [
  {
    id: 'vikramaditya-rao',
    name: 'Vikramaditya Rao',
    role: 'Founder & Principal Architect',
    department: 'Architecture & Design',
    experience: '25+ Years Experience',
    credentials: 'AA Dip. London, IIA Fellow',
    bio: 'Educated at the Architectural Association in London, Vikramaditya founded Symmetry to redefine turnkey architectural execution in South Asia. He personally directs spatial philosophy and master commissions.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    specialties: ['Spatial Geometry', 'Monolithic Architecture', 'Master Planning'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'elena-rossi',
    name: 'Elena Rossi',
    role: 'Head of Global Sourcing & Materials',
    department: 'Sourcing & Materials',
    experience: '19 Years Experience',
    credentials: 'Politecnico di Milano, M.Arch',
    bio: 'Splitting her time between Milan, Verona, and Hyderabad, Elena maintains our direct quarry allocations in Italy and vetted artisan ateliers across Europe and Southeast Asia.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    specialties: ['Marble Quarry Selection', 'Bespoke Haute Leathers', 'Provenance Vetting'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'raghavan-s-nair',
    name: 'Raghavan S. Nair',
    role: 'Director of Turnkey Civil Execution',
    department: 'Fabrication & Engineering',
    experience: '24 Years Experience',
    credentials: 'M.Tech Civil (IIT Madras), PMP',
    bio: 'A veteran civil structural engineer with two decades of directing high-value infrastructure and palatial residential builds. Raghavan commands site precision, MEPF coordination, and zero-defect handover.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    specialties: ['Structural Engineering', 'Site Coordination', 'Schedule Adherence'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'ananya-deshmukh',
    name: 'Ananya Deshmukh',
    role: 'Lead Interior Architect & Scenographer',
    department: 'Architecture & Design',
    experience: '12 Years Experience',
    credentials: 'CEPT Ahmedabad, B.Arch',
    bio: 'Specializing in residential atmospheres, Ananya orchestrates spatial choreography, bespoke millwork details, and the delicate equilibrium between tactile stone and soft linen drapery.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    specialties: ['Interior Spatial Choreography', 'Bespoke Millwork', 'Curated Textiles'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    role: 'Head of CNC Fabrication & Prototyping',
    department: 'Fabrication & Engineering',
    experience: '15 Years Experience',
    credentials: 'B.Eng Industrial Design (NTU Singapore)',
    bio: 'Marcus oversees our 25,000 sq.ft. fabrication unit in Hyderabad, programming 5-axis routers, laser edgebanding lines, and custom architectural metal forging jigs.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    specialties: ['5-Axis CNC Programming', 'Laser Tolerancing', 'Metal Forging'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'sunita-krishnamurthy',
    name: 'Sunita Krishnamurthy',
    role: 'Director of Acoustic & Lighting Design',
    department: 'Architecture & Design',
    experience: '14 Years Experience',
    credentials: 'M.Sc Architectural Lighting (KTH Sweden)',
    bio: 'Sunita engineers sensory environments through concealed circadian lighting systems and invisible micro-perforated acoustic panels, creating spaces that feel as peaceful as they look.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    specialties: ['Circadian Lighting', 'Architectural Acoustics', 'Sensory Design'],
    linkedin: 'https://linkedin.com',
  },
];

// 9. Why Choose Symmetry (Pillars & Comparison)
export const whyChoosePillars = [
  {
    number: '01',
    title: '25+ Years of Expertise',
    desc: 'Proven experience in sourcing, interiors, and turnkey execution with over two decades of industry leadership.',
    icon: Building2,
    stat: '25+ Years',
  },
  {
    number: '02',
    title: 'Global Sourcing',
    desc: 'Furniture and materials sourced directly from leading design destinations across Italy, China, Malaysia, and Bali.',
    icon: Globe2,
    stat: 'Global Hubs',
  },
  {
    number: '03',
    title: 'End-to-End Solutions',
    desc: 'One trusted partner from concept to final installation, ensuring smooth coordination and zero friction.',
    icon: ShieldCheck,
    stat: 'Turnkey Partner',
  },
  {
    number: '04',
    title: 'Bespoke Design',
    desc: 'Solutions tailored precisely to each client’s unique vision, functional requirements, and space.',
    icon: Cpu,
    stat: '100% Tailored',
  },
  {
    number: '05',
    title: 'Quality Craftsmanship',
    desc: 'Premium materials, refined finishes, and careful execution engineered for enduring permanence.',
    icon: Award,
    stat: 'Premium Quality',
  },
  {
    number: '06',
    title: 'Diverse Experience',
    desc: 'Proven expertise spanning residential, hospitality, commercial, healthcare, and institutional projects.',
    icon: Clock,
    stat: 'All Sectors',
  },
];

export const comparisonData = [
  {
    feature: 'Execution Model',
    traditional: 'Multiple fragmented subcontractors with conflicting schedules and finger-pointing',
    symmetry: 'Fully unified turnkey team with single-point engineering director accountability',
  },
  {
    feature: 'Material Sourcing',
    traditional: 'Bought from regional retail dealers with 30-50% markups and unknown provenance',
    symmetry: 'Direct quarry and atelier allocations in Italy, China, Malaysia with origin passports',
  },
  {
    feature: 'Fabrication Precision',
    traditional: 'Hand-sawed on dusty site floors with visible misalignments and 3-5mm gaps',
    symmetry: '25,000 sq.ft. cleanroom facility with German 5-axis CNC routers & 0.5mm tolerances',
  },
  {
    feature: 'Warranty & Support',
    traditional: 'Contractors vanish after final payment; zero after-sales maintenance support',
    symmetry: 'Formal 10-Year structural warranty + dedicated annual preventative maintenance team',
  },
];
