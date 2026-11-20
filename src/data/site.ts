/**
 * Central site configuration.
 *
 * Any value left as an empty string is rendered as a clearly marked
 * placeholder in the UI. Fill these in with the OFFICIAL links/details —
 * nothing here is invented.
 */

export interface NavItem {
  label: string;
  to: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Our Team', to: '/team' },
];

export interface ExternalLink {
  label: string;
  /** Leave '' until the official URL is supplied. */
  href: string;
}

export const SITE = {
  name: 'µLearn CHN',
  fullName: 'Gtech µLearn CHN',
  institution: 'College of Engineering Chengannur',
  tagline: 'Learn together. Build together.',
};

/** Official links — TODO: replace the empty strings with verified URLs. */
export const LINKS = {
  join: { label: 'Join µLearn', href: 'http://app.mulearn.org/register' } as ExternalLink,
  discord: { label: 'Discord', href: 'https://discord.com/invite/DfnDfBhGha' } as ExternalLink,
  instagram: { label: 'Instagram', href: 'https://www.instagram.com/mulearn.chn' } as ExternalLink,
  linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/company/gtech-mulearn-cec/' } as ExternalLink,
  github: { label: 'GitHub', href: 'https://github.com/gtech-mulearn' } as ExternalLink,
  youtube: { label: 'YouTube', href: 'https://www.youtube.com/@mulearn' } as ExternalLink,
  mulearnOfficial: { label: 'µLearn', href: 'https://mulearn.org' } as ExternalLink,
};

export const CONTACT = {
  /** TODO: official community email, e.g. 'hello@example.org' */
  email: 'gtechmulearncec@gmail.com',
  /** TODO: campus / venue details */
  address: 'College of Engineering Chengannur, Chengannur, Kerala',
};

export const SOCIAL_LINKS: ExternalLink[] = [
  LINKS.instagram,
  LINKS.linkedin,
  LINKS.github,
  LINKS.youtube,
  LINKS.discord,
];
