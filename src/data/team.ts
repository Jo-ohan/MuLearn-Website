/**
 * Team data — µLearn CHN Chapter.
 *
 * All 21 members organized into 5 groups:
 * Leadership, Core Team, Operations & Design, Content & Media, Interest Group Leads.
 * Design uses text-based cards (names & purple-accent designations) without photographs.
 */

export type TeamGroupId =
  | 'leadership'
  | 'core'
  | 'operations-design'
  | 'content-media'
  | 'interest-groups';

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  group: TeamGroupId;
  /** Optional URL or imported path to a circular profile photo. */
  image?: string;
  photo?: string;
  bio?: string;
  links?: { label: string; href: string }[];
  placeholder?: boolean;
}

export const TEAM_GROUPS: { id: TeamGroupId; title: string; blurb: string }[] = [
  { id: 'leadership', title: 'Leadership', blurb: 'Guiding the vision and direction of µLearn CHN.' },
  { id: 'core', title: 'Core Team', blurb: 'Leading operations, technical initiatives, media, and content.' },
  { id: 'operations-design', title: 'Operations & Design', blurb: 'Managing campus coordination and visual identity.' },
  { id: 'content-media', title: 'Content & Media', blurb: 'Storytelling, documentation, and community outreach.' },
  { id: 'interest-groups', title: 'Interest Group Leads', blurb: 'Mentoring specialized domains across campus.' },
];

export const TEAM: TeamMember[] = [
  // 1. Leadership (4)
  {
    id: 'geetha-s',
    name: 'Geetha S',
    designation: 'Lead Enabler',
    image: 'https://res.cloudinary.com/dsyus516r/image/upload/v1793550435/geetha_hebv4k.jpg',
    group: 'leadership',
  },
  {
    id: 'nithin-jayakumar',
    name: 'Nithin Jayakumar',
    designation: 'Campus Lead',
    image: 'https://res.cloudinary.com/dsyus516r/image/upload/v1781766715/Nithin_img_b8crqm.jpg',
    group: 'leadership',
  },
  {
    id: 'divyalakshmi',
    name: 'Divyalakshmi',
    designation: 'Campus Co-Lead',
    image: 'https://res.cloudinary.com/dctmapb3t/image/upload/v1780429835/actjsiebxpl15u8comlk.jpg',
    group: 'leadership',
  },
  {
    id: 'govind-j-s',
    name: 'Govind J S',
    designation: 'Creative Lead',
    image: 'https://cdn.jsdelivr.net/gh/AmanulFarhan/mulearn_images@main/webp/govind.webp',
    group: 'leadership',
  },

  // 2. Core Team (4)
  {
    id: 'hanin-c-k',
    name: 'Hanin C K',
    designation: 'Operation Lead',
    group: 'core',
  },
  {
    id: 'amanul-farhan',
    name: 'Amanul Farhan',
    designation: 'Technical Lead',
    group: 'core',
  },
  {
    id: 'pavithra-a',
    name: 'Pavithra A',
    designation: 'Media Lead',
    group: 'core',
  },
  {
    id: 'albin-thomas',
    name: 'Albin Thomas',
    designation: 'Content Lead',
    group: 'core',
  },

  // 3. Operations & Design (4)
  {
    id: 'melwin-shibu-mathew',
    name: 'Melwin Shibu Mathew',
    designation: 'Operation Team',
    group: 'operations-design',
  },
  {
    id: 'sara-shaji',
    name: 'Sara Shaji',
    designation: 'Operation Team',
    group: 'operations-design',
  },
  {
    id: 'afsal-s',
    name: 'Afsal S',
    designation: 'Designer',
    group: 'operations-design',
  },
  {
    id: 'vismaya-gawri-krishnan',
    name: 'Vismaya Gawri Krishnan',
    designation: 'Designer',
    group: 'operations-design',
  },

  // 4. Content & Media (4)
  {
    id: 'karthika-s',
    name: 'Karthika S',
    designation: 'Content Team',
    group: 'content-media',
  },
  {
    id: 'sreelakshmi-m',
    name: 'Sreelakshmi M',
    designation: 'Content Team',
    group: 'content-media',
  },
  {
    id: 'parvathy-vinayan',
    name: 'Parvathy Vinayan',
    designation: 'Media Team',
    group: 'content-media',
  },
  {
    id: 'brijith-k-reji',
    name: 'Brijith K Reji',
    designation: 'Media Team',
    group: 'content-media',
  },

  // 5. Interest Group Leads (5)
  {
    id: 'adhi-narayan',
    name: 'Adhi Narayan',
    designation: 'IG Lead-AI',
    group: 'interest-groups',
  },
  {
    id: 'al-ameen',
    name: 'Al Ameen',
    designation: 'IG Lead-UI/UX',
    group: 'interest-groups',
  },
  {
    id: 'amal-s',
    name: 'Amal S',
    designation: 'IG Lead-Cyber Security',
    group: 'interest-groups',
  },
  {
    id: 'abhiram-j',
    name: 'Abhiram J',
    designation: 'IG Lead-Web',
    group: 'interest-groups',
  },
  {
    id: 'swathy-j',
    name: 'Swathy J',
    designation: 'IG Lead-Entrepreneurship',
    group: 'interest-groups',
  },
];

/** Members shown in the Home page team preview. */
export const TEAM_PREVIEW_IDS = [
  'geetha-s',
  'nithin-jayakumar',
  'divyalakshmi',
  'govind-j-s',
];
