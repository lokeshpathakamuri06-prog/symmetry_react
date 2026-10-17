export const jobDepartments = ['Design', 'Execution', 'Visualisation', 'Client Relations'];

export const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

// Careers page content. Position keys must match CAREER_AREAS in the backend (app/api/public_forms.py).

export const opportunityAreas = [
  {
    key: 'interior-designer',
    title: 'Interior Design & Space Planning',
    position: 'Interior Designer',
    description: 'Shape layouts, mood boards and material palettes for homes, offices and hospitality spaces.',
  },
  {
    key: 'architecture-drafting',
    title: 'Architecture & Technical Drafting',
    position: 'Architecture & Technical Drafting',
    description: 'Turn concepts into accurate plans, elevations and working drawings that sites can build from.',
  },
  {
    key: '3d-visualization',
    title: '3D Visualization & Rendering',
    position: '3D Visualization & Rendering',
    description: 'Model and render spaces so clients can see and refine a design before work begins.',
  },
  {
    key: 'furniture-materials',
    title: 'Furniture Design & Material Research',
    position: 'Furniture Design & Material Research',
    description: 'Study furniture, finishes and materials, and help develop pieces suited to each project.',
  },
  {
    key: 'project-coordination',
    title: 'Project Coordination & Site Execution',
    position: 'Project Coordination & Site Execution',
    description: 'Follow work on site, coordinate teams and suppliers, and see how designs are installed.',
  },
  {
    key: 'marketing-content',
    title: 'Marketing & Creative Content',
    position: 'Marketing & Creative Content',
    description: 'Tell the story of our projects through photography, social media, writing and design.',
  },
];

export const GENERAL_POSITION = { key: 'general', position: 'General Application' };

export const experienceLevels = ['Fresher / Student', '0–1 year', '1–3 years', '3–5 years', '5+ years'];

export const expectations = [
  'Exposure to real-world design and project workflows.',
  'Opportunities to learn from experienced professionals.',
  'Understanding of furniture, finishes, sourcing, and execution.',
  'Practical assignments that help build your portfolio.',
];

export const programmeStructure = [
  { label: 'Internship duration', value: '2–6 months, depending on department and academic requirements.' },
  { label: 'Fresher opportunities', value: 'Full-time roles based on vacancies and suitability.' },
  { label: 'Stipend', value: 'To be communicated in the individual internship listing.' },
  { label: 'Eligibility', value: 'Students, recent graduates, and candidates with relevant portfolios or practical skills.' },
];

export const hiringSteps = [
  { title: 'Application', text: 'Submit your resume, portfolio, and the role you are interested in.' },
  { title: 'Resume & Portfolio Review', text: 'Our team reviews your experience, skills, creativity, and suitability for the role.' },
  { title: 'Interview', text: 'Discuss your experience, working style, interests, and career goals.' },
  { title: 'Design or Practical Assessment', text: 'Selected candidates may complete a role-specific task to demonstrate relevant skills.' },
  { title: 'Offer & Onboarding', text: 'Successful candidates receive the role details and next steps for joining.' },
];

// SAMPLE text only, shown with a "sample" note on the page. Replace with approved quotes from
// real team members (and remove the note in Careers.jsx) before treating them as testimonials.
export const sampleTeamVoices = [
  {
    role: 'Design Team Member',
    quote: 'Working across different projects gives me the opportunity to understand how design decisions translate into real spaces. Every project brings something new to learn.',
  },
  {
    role: 'Projects or Sourcing Team Member',
    quote: 'Collaborating with different teams has helped me build a better understanding of materials, furniture, and the execution process.',
  },
  {
    role: 'Visualization or Design Team Member',
    quote: 'The best part is seeing an idea evolve from a concept into a finished space. It makes the work meaningful.',
  },
];
