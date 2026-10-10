// Links built from the company details edited in Page Content (siteSections.company)

const digits = (phone) => (phone || '').replace(/[^0-9]/g, '');

export const telHref = (phone) => {
  const d = digits(phone);
  return d ? `tel:+${d.startsWith('0') ? `91${d.slice(1)}` : d}` : undefined;
};

export const whatsappHref = (phone, message) => {
  const d = digits(phone);
  if (!d) return undefined;
  return `https://wa.me/${d}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
};

export const mailHref = (email) => (email ? `mailto:${email}` : undefined);

export const mapsHref = (query) => `https://maps.google.com/?q=${encodeURIComponent(query || '')}`;

export const mapsEmbedSrc = (query, satellite = false) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query || '')}&t=${satellite ? 'k' : 'm'}&z=16&ie=UTF8&iwloc=&output=embed`;
