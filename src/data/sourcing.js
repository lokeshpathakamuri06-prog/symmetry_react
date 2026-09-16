import { 
  Compass, 
  ShieldCheck, 
  Gem, 
  Truck, 
  Box 
} from 'lucide-react';

// The 5 Curated Global Sourcing Countries
export const sourcingCountries = [
  {
    id: 'italy',
    anchorId: 'sourcing-italy',
    chapter: '01',
    name: 'Italy',
    flag: '🇮🇹',
    region: 'Milan, Verona & Carrara',
    coordinates: '45.4642° N, 9.1900° E',
    mapCoords: { x: 50.5, y: 31 }, // % on stylized map
    tagline: 'Quarry-Direct Marbles & Haute Leather Ateliers',
    description:
      'Our twenty-five-year direct alliance with century-old quarries in Verona and Carrara gives Symmetry patrons direct access to the vein face before extraction. In the Brianza district north of Milan, multi-generational furniture ateliers tailor bespoke full-grain aniline and saddle hides, hand-stretched over precision steel frames.',
    largeImage: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1600&q=85',
        caption: 'Verona & Carrara Marble Extraction Quarries',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
        caption: 'Calacatta Borghini Bookmatched Stone Slab',
      },
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
        caption: 'Hand-Stretched Full-Grain Tuscan Saddle Leather',
      },
    ],
    productsSourced: [
      'Bookmatched Roman Travertine & Calacatta Borghini Slabs',
      'Full-Grain Tuscan Saddle Leather Armchairs & Daybeds',
      'Hand-Blown Murano Venetian Glass Chandeliers',
      'Brianza High-Precision Minimalist Dining Tables',
      'Antiqued Italian Bronze & Brass Architectural Hardware',
    ],
    craftsmanshipHighlights: [
      'Hand-selected marble blocks inspected at the quarry wire before slicing',
      'Bookmatching tolerance calibrated within 0.5mm across consecutive slabs',
      'Aniline vegetable tanning preserving natural leather breathability & patina',
      'Ancestral free-blown Murano glass shaping using wooden pontil rods',
    ],
    provenanceYears: '25 Years Direct Alliance',
    partnerAteliers: '18 Vetted Italian Workshops',
  },
  {
    id: 'china',
    anchorId: 'sourcing-china',
    chapter: '02',
    name: 'China',
    flag: '🇨🇳',
    region: 'Foshan & Greater Bay Area',
    coordinates: '23.0215° N, 113.1214° E',
    mapCoords: { x: 79, y: 44 },
    tagline: 'Precision 5-Axis CNC Joinery & Architectural Bronzes',
    description:
      'Foshan and Shenzhen stand at the global apex of computerized architectural engineering. Symmetry partners with aerospace-grade metal fabricators and curved glass foundries capable of executing sub-millimeter tolerances on large-scale architectural doors, titanium PVD finishes, and curved structural acoustic partitions.',
    largeImage: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1600&q=85',
        caption: 'Shenzhen Architectural Metal & Curved Glass Hub',
      },
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        caption: 'Sub-Millimeter 5-Axis CNC Laser Machining Center',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        caption: 'Titanium PVD Coated Architectural Pivot Portals',
      },
    ],
    productsSourced: [
      'Custom Extruded Architectural Bronze & Gunmetal Envelopes',
      'Ultra-Clear Low-Iron Curved Acoustic Double Glazing',
      'Titanium PVD Coated Stainless Steel Facades & Partitions',
      'Heavy-Duty Concealed Magnetic Pivot Portals & Tracks',
      '5-Axis CNC Milled Metal Furniture Bases & Credenzas',
    ],
    craftsmanshipHighlights: [
      'Sub-millimeter CNC tolerances (±0.3mm) across extruded profiles',
      'Multi-coat titanium PVD treatment resistant to oxidation & coastal corrosion',
      'Double-laminated acoustic interlayer glass achieving STC 48+ isolation',
      'Laser-welded corner miters invisible to the naked eye',
    ],
    provenanceYears: '18 Years Direct Alliance',
    partnerAteliers: '12 Technological Manufacturing Centers',
  },
  {
    id: 'malaysia',
    anchorId: 'sourcing-malaysia',
    chapter: '03',
    name: 'Malaysia',
    flag: '🇲🇾',
    region: 'Selangor & Penang',
    coordinates: '3.0738° N, 101.5183° E',
    mapCoords: { x: 77.5, y: 56 },
    tagline: 'FSC-Certified Plantation Teak & Vacuum Kiln-Dried Hardwoods',
    description:
      'Southeast Asian tropical hardwood reserves produce some of the most dimensionally stable timbers on earth. We contract directly with FSC-certified plantations, seasoning raw Golden Teak and Balau logs in computerized vacuum kilns to precisely 8–10% moisture content—ensuring zero monsoonal warping in luxury homes.',
    largeImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=85',
        caption: 'FSC-Certified Old-Growth Plantation Reserves',
      },
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        caption: 'Computerized Vacuum Kiln-Dried Teak Grain',
      },
      {
        url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
        caption: 'Single-Slab Monolithic Hardwood Dining Masterpiece',
      },
    ],
    productsSourced: [
      'Vacuum Kiln-Dried Golden Teak Structural Beams & Decking',
      'Quarter-Sawn Exotic Veneers (Merbau, Balau & Red Meranti)',
      'Marine-Grade Outdoor Architectural Louvers & Pergolas',
      'Solid Monolithic Hardwood Dining Tables (Single Slab)',
      'Hand-Carved Acoustic Ceiling Grilles & Privacy Screens',
    ],
    craftsmanshipHighlights: [
      '100% FSC-certified ethical plantation forestry with full chain of custody',
      'Vacuum drying chamber calibration down to 8–10% internal equilibrium moisture',
      'Naturally high silica & natural oil content for perpetual pest resistance',
      'Continuous wide-plank wood selection avoiding patchwork finger joints',
    ],
    provenanceYears: '21 Years Direct Alliance',
    partnerAteliers: '8 Certified Timber Estates',
  },
  {
    id: 'vietnam',
    anchorId: 'sourcing-vietnam',
    chapter: '04',
    name: 'Vietnam',
    flag: '🇻🇳',
    region: 'Binh Duong & Da Nang',
    coordinates: '11.0168° N, 106.6663° E',
    mapCoords: { x: 79.5, y: 49 },
    tagline: 'Handcrafted Cane, Natural Rattan & Deep Ceramic Glazes',
    description:
      'Vietnam’s multi-generational artisanal craft villages hold irreplaceable heritage knowledge. Our curation teams partner with generational weavers who transform natural split rattan and cane into micro-woven acoustic wall panels, and master ceramicists wood-firing architectural stoneware planters in traditional dragon kilns.',
    largeImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85',
        caption: 'Generational Craft Villages & Dragon Kiln Enclaves',
      },
      {
        url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80',
        caption: 'Handwoven Natural Cane & Micro-Rattan Paneling',
      },
      {
        url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
        caption: 'High-Fired Vitrified Architectural Stoneware Planters',
      },
    ],
    productsSourced: [
      'Hand-Woven Natural Rattan & Octagonal Cane Paneling',
      'Wood-Fired Architectural Stoneware Urns & Planters (Up to 1.8m)',
      'Acoustic Woven Grasscloth & Natural Cordage Wallcoverings',
      'Sculptural Indoor-Outdoor Lounge Seating with Weathered Patina',
      'Hand-Hammered Water Hyacinth & Jute Sculptural Baskets',
    ],
    craftsmanshipHighlights: [
      'Multi-generational hand-weaving techniques utilizing untreated wild rattan',
      'High-temperature dragon kiln firing (1,280°C) producing frostproof vitrified stoneware',
      'Deep organic wood-ash and iron-slip reduction glazes with tactile depth',
      'Natural fungal-inhibiting treatments without hazardous chemical biocides',
    ],
    provenanceYears: '14 Years Direct Alliance',
    partnerAteliers: '14 Artisanal Craft Guilds',
  },
  {
    id: 'bali',
    anchorId: 'sourcing-bali',
    chapter: '05',
    name: 'Bali',
    flag: '🇮🇩',
    region: 'Gianyar & Ubud',
    coordinates: '8.5069° S, 115.2625° E',
    mapCoords: { x: 81.5, y: 64 },
    tagline: 'Monolithic Volcanic Stone, Teak Roots & Biophilic Sculptures',
    description:
      'Nestled in the volcanic hills of Gianyar and Ubud, Balinese stonecutters carve monolithic volcanic basalt and river boulders into sculptural washbasins and soaking tubs. We source reclaimed century-old teak root formations and hand-troweled lime plaster urns that introduce raw natural soul into contemporary minimalist architecture.',
    largeImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85',
        caption: 'Ubud Volcanic Terraces & Master Stonecutting Enclaves',
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        caption: 'Hand-Carved Volcanic Basalt Monolithic Soaking Tub',
      },
      {
        url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
        caption: 'Sculptural Reclaimed Century-Old Teak Root Masterpiece',
      },
    ],
    productsSourced: [
      'Monolithic Volcanic Basalt Bathtubs & Riverstone Sinks',
      'Sculptural Reclaimed Teak Root Coffee & Console Tables',
      'Hand-Chiseled Andesite Stone Water Features & Stepping Pavers',
      'Biophilic Timber Wall Sculptures & Organic Room Dividers',
      'Hand-Troweled Natural Volcanic Ash & Lime Plaster Vessels',
    ],
    craftsmanshipHighlights: [
      'Single-boulder stone carving preserving the raw natural volcanic exterior skin',
      'Artisanal wet-polishing achieving velvety matte interiors without chemical sealers',
      'Reclaimed ancient teak root salvage supporting zero-deforestation principles',
      'Every organic sculptural piece is inherently one-of-a-kind and serialized',
    ],
    provenanceYears: '16 Years Direct Alliance',
    partnerAteliers: '9 Master Carver Ateliers',
  },
];

// Sourcing Process (The 5 exact steps requested)
export const sourcingProcess = [
  {
    step: '01',
    name: 'Discover',
    tagline: 'Architectural Curation & Material Profiling',
    desc: 'Translating design intent into precise engineering drawings, tactile moodboards, and material specifications calibrated to client lifestyle and climate.',
    deliverables: ['3D Material Mood Trays', 'Dimensional Tolerances', 'Origin Feasibility Matrix'],
    icon: Compass,
  },
  {
    step: '02',
    name: 'Select',
    tagline: 'Quarry Inspection & Direct Atelier Allocation',
    desc: 'Our sourcing directors travel to Verona quarries, Brianza workshops, and Balinese stone ateliers to hand-inspect raw blocks and commission custom prototypes.',
    deliverables: ['Quarry Slab Vein Approval', 'Prototype Rub-Count Vetting', 'Direct Factory Booking'],
    icon: Gem,
  },
  {
    step: '03',
    name: 'Quality Check',
    tagline: 'Multi-Point Forensic Testing at Source',
    desc: 'Conducting non-destructive ultrasound stone testing, timber moisture verification (8–10% EMC), and laser alignment audits before crating at the origin atelier.',
    deliverables: ['Moisture Equilibrium Audit', 'Laser Reveal Calibration', 'Certificate of Provenance'],
    icon: ShieldCheck,
  },
  {
    step: '04',
    name: 'Logistics',
    tagline: 'Sealed Climate-Controlled Freight & Customs Clearance',
    desc: 'Delicate veneers and stones travel in moisture-stabilized sea containers with GPS shock and temperature telemetry. Licensed expeditors manage port clearance.',
    deliverables: ['Climate-Sealed Maritime Box', 'GPS Shock Telemetry', 'Port Duty Documentation'],
    icon: Truck,
  },
  {
    step: '05',
    name: 'Delivery',
    tagline: 'White-Glove Placement & Archival Handover',
    desc: 'Our white-glove logistics squad unpacks, structurally anchors, and cleans every piece in your home, presenting an archival provenance passport for your collection.',
    deliverables: ['Room-of-Choice Installation', 'Microfiber Surface Treatment', 'Archival Warranty Binder'],
    icon: Box,
  },
];

// Stats Bar
export const sourcingStats = [
  { value: '25+', label: 'Years Direct Sourcing', sub: 'Est. 1999' },
  { value: '0%', label: 'Middlemen Markups', sub: 'Direct Quarry & Factory' },
  { value: '100%', label: 'In-Person Vetting', sub: 'Before Crating & Dispatch' },
  { value: '14', label: 'Global Sourcing Hubs', sub: 'Europe & Pan-Asia' },
];
