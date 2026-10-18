// Ready-made answers for the website chat (ChatBot.jsx). No outside service: a question is matched
// to a topic by keywords, and the answer is built from the company details in Page Content
// (siteSections.company) and the site's own data, so it stays in step with what the site says.

import { services } from '../data/services';
import { mapsHref, telHref, mailHref, whatsappHref } from './contact';

// Words are compared in lower case without punctuation; a topic scores one point per keyword found
const TOPICS = [
  { id: 'greeting', words: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening', 'good afternoon'] },
  { id: 'thanks', words: ['thank', 'thanks', 'thx', 'great', 'perfect', 'awesome', 'bye', 'goodbye'] },
  { id: 'consultation', words: ['consult', 'consultation', 'appointment', 'book', 'meeting', 'meet', 'visit studio', 'site visit', 'schedule', 'start a project', 'start my project', 'quote', 'estimate'] },
  { id: 'services', words: ['service', 'services', 'what do you do', 'offer', 'interior design', 'turnkey', 'renovation', 'design', 'planning', 'residential', 'commercial', 'office', 'hotel', 'hospital', 'healthcare', 'villa', 'apartment'] },
  { id: 'price', words: ['price', 'prices', 'cost', 'costs', 'budget', 'charge', 'charges', 'fee', 'fees', 'rate', 'rates', 'expensive', 'how much', 'per sq', 'sq ft', 'sqft'] },
  { id: 'hours', words: ['hours', 'timing', 'timings', 'open', 'opening', 'close', 'closing', 'sunday', 'saturday', 'working days', 'when are you'] },
  { id: 'address', words: ['address', 'location', 'located', 'where', 'directions', 'map', 'office', 'studio', 'showroom', 'ameerpet', 'hyderabad'] },
  { id: 'contact', words: ['phone', 'call', 'number', 'contact', 'email', 'mail', 'reach', 'talk', 'whatsapp', 'human', 'person', 'agent'] },
  { id: 'shop', words: ['shop', 'buy', 'purchase', 'furniture', 'sofa', 'table', 'chair', 'bed', 'lighting', 'lamp', 'decor', 'product', 'products', 'cart', 'order', 'catalog', 'catalogue'] },
  { id: 'delivery', words: ['delivery', 'deliver', 'shipping', 'ship', 'dispatch', 'installation', 'install', 'gst', 'tax'] },
  { id: 'projects', words: ['project', 'projects', 'portfolio', 'work', 'previous work', 'examples', 'case study', 'gallery', 'photos'] },
  { id: 'sourcing', words: ['sourcing', 'source', 'import', 'imported', 'italy', 'italian', 'china', 'malaysia', 'vietnam', 'bali', 'marble', 'stone', 'travertine', 'quarry'] },
  { id: 'bespoke', words: ['custom', 'customised', 'customized', 'bespoke', 'made to order', 'made-to-measure', 'workshop', 'factory', 'cnc', 'carpentry', 'joinery', 'wardrobe', 'kitchen'] },
  { id: 'timeline', words: ['how long', 'timeline', 'duration', 'time take', 'weeks', 'months', 'deadline', 'process', 'steps'] },
  { id: 'warranty', words: ['warranty', 'guarantee', 'after sales', 'after-sales', 'maintenance', 'repair', 'support'] },
  { id: 'about', words: ['about', 'who are you', 'company', 'experience', 'years', 'history', 'team', 'founder'] },
  { id: 'careers', words: ['job', 'jobs', 'career', 'careers', 'hiring', 'vacancy', 'vacancies', 'internship', 'intern', 'apply', 'resume', 'cv'] },
  { id: 'admin', words: ['login', 'log in', 'sign in', 'signin', 'admin', 'password', 'dashboard'] },
];

const normalise = (text) => ` ${String(text || '').toLowerCase().replace(/[^a-z0-9₹\s-]/g, ' ').replace(/\s+/g, ' ').trim()} `;

/** The best-matching topic id for a question, or null when nothing matches */
export const matchTopic = (question) => {
  const q = normalise(question);
  let best = null;
  let bestScore = 0;
  for (const topic of TOPICS) {
    // Whole words / phrases only, so "hi" does not match "hiring"
    const score = topic.words.reduce((n, w) => (q.includes(` ${w} `) || q.includes(` ${w}s `) ? n + (w.includes(' ') ? 2 : 1) : n), 0);
    if (score > bestScore) {
      best = topic.id;
      bestScore = score;
    }
  }
  return best;
};

/** Suggested questions shown as tap-to-ask chips */
export const STARTER_CHIPS = ['Book a consultation', 'Your services', 'Prices & budget', 'Studio address & hours', 'Shop furniture', 'Talk to the team'];

/**
 * Answer for a question: { text, links: [{ label, to } | { label, href }], chips: [...] }.
 * `company` is siteSections.company; `name` is the visitor's first name.
 */
export const answerFor = (question, { company = {}, name = '' } = {}) => {
  const topic = matchTopic(question);
  const phones = [company.phonePrimary, company.phoneSecondary].filter(Boolean).join(' / ');
  const wa = whatsappHref(company.whatsappNumber, `Hello, I have a question: ${question}`);
  const teamLinks = [
    wa && { label: 'WhatsApp us', href: wa },
    company.phonePrimary && { label: 'Call us', href: telHref(company.phonePrimary) },
  ].filter(Boolean);

  switch (topic) {
    case 'greeting':
      return {
        text: `Hello${name ? ` ${name}` : ''}! How can I help you today? You can ask about our services, prices, the studio, the shop or booking a consultation.`,
        chips: STARTER_CHIPS.slice(0, 4),
      };
    case 'thanks':
      return {
        text: 'You are welcome! If anything else comes up, just ask here. Our team can also call you back on the number you shared.',
        chips: ['Book a consultation', 'Talk to the team'],
      };
    case 'consultation':
      return {
        text: 'We would love to hear about your space. Book a private design consultation on the Contact page (studio visit or site visit), or message us on WhatsApp and we will set up a time.',
        links: [{ label: 'Book a consultation', to: '/contact' }, ...teamLinks.slice(0, 1)],
        chips: ['Prices & budget', 'How long does a project take?'],
      };
    case 'services':
      return {
        text: `We design and deliver complete interiors, from first sketch to final styling, under one roof:\n${services
          .map((s) => `• ${s.title}`)
          .join('\n')}`,
        links: [{ label: 'See all services', to: '/services' }],
        chips: ['Book a consultation', 'Prices & budget', 'See your projects'],
      };
    case 'price':
      return {
        text: 'Every interior is designed for its space, so the cost depends on the area, the scope (design only or complete turnkey) and the materials you choose. After a short consultation we share a detailed estimate. Furniture in our shop shows its price on each piece.',
        links: [{ label: 'Get an estimate', to: '/contact' }, { label: 'Shop prices', to: '/shop' }],
        chips: ['Book a consultation', 'Delivery & GST'],
      };
    case 'hours':
      return {
        text: company.hours
          ? `Our studio is open ${company.hours}. Sundays are by appointment.`
          : 'Our studio is open Monday to Saturday; Sundays are by appointment.',
        links: [{ label: 'Book a visit', to: '/contact' }],
        chips: ['Studio address', 'Talk to the team'],
      };
    case 'address':
      return {
        text: company.officeAddress
          ? `You can visit us at:\n${company.officeAddress}${company.hours ? `\n\nOpen ${company.hours}; Sundays by appointment.` : ''}`
          : 'Our studio is in Hyderabad. See the Contact page for directions.',
        links: [company.officeAddress && { label: 'Get directions', href: mapsHref(company.officeAddress) }, { label: 'Contact page', to: '/contact' }].filter(Boolean),
        chips: ['Book a consultation'],
      };
    case 'contact':
      return {
        text: [
          'You can reach our team directly:',
          phones && `Phone: ${phones}`,
          company.whatsappNumber && `WhatsApp: ${company.whatsappNumber}`,
          company.email && `Email: ${company.email}`,
        ]
          .filter(Boolean)
          .join('\n'),
        links: [...teamLinks, company.email && { label: 'Email us', href: mailHref(company.email) }].filter(Boolean),
      };
    case 'shop':
      return {
        text: 'Our shop has sofas, dining and bedroom furniture, chairs, lighting and decor, each made to order in our own workshop. You can add pieces to your bag and send an order request; our team confirms the details with you. The full catalogue is also available as a PDF.',
        links: [{ label: 'Open the shop', to: '/shop' }, { label: 'Catalogue (PDF)', href: '/Symmetry-Interiors-Catalog.pdf' }],
        chips: ['Delivery & GST', 'Custom furniture'],
      };
    case 'delivery':
      return {
        text: 'Shop prices are shown before 18% GST. Delivery is free on orders above ₹1,50,000; below that a delivery charge of ₹3,500 applies. Our team confirms delivery and installation dates with you after your order request.',
        links: [{ label: 'Open the shop', to: '/shop' }],
        chips: ['Talk to the team'],
      };
    case 'projects':
      return {
        text: 'We have delivered homes, offices, hotels and healthcare spaces. Browse case studies with photos, areas and the materials used on the Projects page.',
        links: [{ label: 'See our projects', to: '/projects' }],
        chips: ['Your services', 'Book a consultation'],
      };
    case 'sourcing':
      return {
        text: 'We source directly from makers, with no traders in between: marble and leather from Italy, precision metalwork from China, certified hardwoods from Malaysia, crafts from Vietnam and stone and carving from Bali. Every piece is checked at the source before it ships.',
        links: [{ label: 'How we source', to: '/sourcing' }],
        chips: ['Custom furniture'],
      };
    case 'bespoke':
      return {
        text: 'Yes, we make custom furniture and joinery to your exact sizes in our own 25,000 sq.ft. CNC workshop in Hyderabad: sofas, tables, wardrobes, kitchens, panelling and more.',
        links: [{ label: 'Bespoke furniture', to: '/services' }, { label: 'Discuss your piece', to: '/contact' }],
        chips: ['Prices & budget'],
      };
    case 'timeline':
      return {
        text: 'Every project follows six steps: Discover, Concept, Design, Source, Execute and Deliver. The time depends on size and scope; your designer shares a schedule with you before work starts, and you get regular progress updates.',
        links: [{ label: 'How a project works', to: '/services' }],
        chips: ['Book a consultation'],
      };
    case 'warranty':
      return {
        text: 'Our turnkey projects come with a 10-year structural warranty, and our team stays with you for after-care once you move in.',
        chips: ['Talk to the team'],
      };
    case 'about':
      return {
        text: 'Symmetry Interiors has over 25 years of experience in global sourcing and complete interior execution, with our own workshop in Hyderabad and one team responsible from design to handover.',
        links: [{ label: 'About us', to: '/about' }],
        chips: ['Your services', 'See your projects'],
      };
    case 'careers':
      return {
        text: `We are always glad to meet designers, site engineers and visualisers. See the open roles and apply on the Careers page${company.careersEmail ? `, or write to ${company.careersEmail}` : ''}.`,
        links: [{ label: 'Open roles', to: '/careers' }],
      };
    case 'admin':
      return {
        text: 'Visitors do not need an account: just chat here or use the Contact page. Symmetry team members can sign in to the admin area.',
        links: [{ label: 'Team sign-in', to: '/admin/login' }],
      };
    default:
      return {
        text: `I am not sure about that one${name ? `, ${name}` : ''}. Our team can answer it for you: message us on WhatsApp or call, and we will also call you back on the number you shared.`,
        links: teamLinks,
        chips: STARTER_CHIPS.slice(0, 4),
      };
  }
};

/** Chip labels that should ask a specific question */
export const CHIP_QUESTIONS = {
  'Your services': 'What services do you offer?',
  'Prices & budget': 'How much does it cost?',
  'Studio address & hours': 'Where is your studio?',
  'Studio address': 'Where is your studio?',
  'Shop furniture': 'I want to buy furniture',
  'Talk to the team': 'How can I contact your team?',
  'Delivery & GST': 'What about delivery and GST?',
  'Custom furniture': 'Do you make custom furniture?',
  'See your projects': 'Show me your projects',
  'How long does a project take?': 'How long does a project take?',
  'Book a consultation': 'I want to book a consultation',
};
