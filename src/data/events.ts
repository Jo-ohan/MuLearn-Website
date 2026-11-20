/**
 * Events data — the single source of truth for the Home and Events pages.
 *
 * To add a real event, append an object to EVENTS and drop its photo/poster in
 * `src/assets/events/` (or /public/events/) and reference it in `image`.
 * Filtering by year and category is derived automatically from this array.
 *
 * Entries with `placeholder: true` are NOT real events — they exist only so the
 * layout and filters can be reviewed. Delete them once real data is added.
 */

import levelUpImg from '../assets/events/levelupin30.png';
import buildAStructImg from '../assets/events/Build_a_Struct.jpg';
import behindTheHackImg from '../assets/events/behindthehack.png';
import mumentImg from '../assets/events/mument2.png';
import aiHackathonImg from '../assets/events/aihackathon.png';

export type EventCategory = 'Workshop' | 'Hackathon' | 'Talk' | 'Meetup' | 'Initiative';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed';

export const EVENT_CATEGORIES: EventCategory[] = [
  'Workshop',
  'Hackathon',
  'Talk',
  'Meetup',
  'Initiative',
];

export interface CommunityEvent {
  id: string;
  name: string;
  /** ISO date, YYYY-MM-DD (start date) */
  date: string;
  /** Optional ISO end date, YYYY-MM-DD for multi-day events. If omitted, event is treated as single-day. */
  endDate?: string;
  category: EventCategory;
  description: string;
  /** Path to a genuine photo or poster. Omit to show a neutral placeholder. */
  image?: string;
  /** Whether the media asset is a designed poster (contained) or an ordinary photo (covered). Defaults to 'poster'. */
  mediaType?: 'poster' | 'photo';
  /** Optional link to an event page / recap. */
  href?: string;
  featured?: boolean;
  placeholder?: boolean;
}

export const EVENTS: CommunityEvent[] = [
  {
    id: 'placeholder-1',
    name: 'Level Up in 30',
    date: '2026-06-21',
    category: 'Workshop',
    description: 'A 30-day mentorship-driven sprint where students follow structured learning paths and build portfolio-ready projects within their chosen Interest Groups.',
    image: levelUpImg,
    featured: true,
    placeholder: false,
  },
  {
    id: 'placeholder-2',
    name: 'Build-a-Struct',
    date: '2026-08-04',
    category: 'Workshop',
    description: 'A week-long hands-on bootcamp where students learn core Data Structures and Algorithms in C through guided sessions and practical problem-solving.',
    image: buildAStructImg,
    placeholder: false,
  },
  {
    id: 'placeholder-3',
    name: 'Behind the Hack',
    date: '2026-02-26',
    category: 'Workshop',
    description: 'A hands-on learning experience that introduces students to cybersecurity fundamentals, ethical hacking, and modern security practices.',
    image: behindTheHackImg,
    featured: true,
    placeholder: false,
  },
  {
    id: 'placeholder-4',
    name: 'µment 2.0',
    date: '2026-02-28',
    category: 'Workshop',
    description: 'A month-long learning journey where students develop practical skills, work on meaningful projects, and receive guidance from experienced mentors.',
    image: mumentImg,
    placeholder: false,
  },
  {
    id: 'placeholder-5',
    name: 'Build with AI',
    date: '2026-04-07',
    category: 'Hackathon',
    description: 'A 16-hour AI-powered hackathon where students collaborate, innovate, and transform ideas into real-world solutions.',
    image: aiHackathonImg,
    featured: true,
    placeholder: false,
  },
];

export const getYears = (events: CommunityEvent[] = EVENTS): number[] =>
  Array.from(new Set(events.map((e) => new Date(e.date).getFullYear()))).sort((a, b) => b - a);

/**
 * Normalizes a Date or string to a local YYYY-MM-DD string representation,
 * avoiding UTC parsing shifts and off-by-one errors.
 */
export const toDateString = (d: string | Date): string => {
  if (typeof d === 'string') {
    const match = d.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
    d = new Date(d);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Reusable function to determine an event's status based on the current date:
 * - upcoming: The event has not started yet (today < start date).
 * - ongoing: Today's date falls between start date and end date inclusive (start <= today <= end).
 * - completed: The event has ended (today > end date).
 *
 * Rules:
 * - Uses date as start date.
 * - Uses endDate as ending date (if omitted, event is treated as single-day).
 * - Reliable ISO string comparisons without timezone off-by-one errors.
 * - Supports referenceDate parameter for deterministic testing, defaults to new Date().
 */
export const getEventStatus = (
  event: Pick<CommunityEvent, 'date' | 'endDate'>,
  referenceDate: string | Date = new Date()
): EventStatus => {
  const today = toDateString(referenceDate);
  const start = toDateString(event.date);
  const end = event.endDate ? toDateString(event.endDate) : start;

  if (today < start) {
    return 'upcoming';
  }
  if (today > end) {
    return 'completed';
  }
  return 'ongoing';
};

/**
 * Returns true if an event is currently ongoing.
 */
export const isEventOngoing = (
  event: Pick<CommunityEvent, 'date' | 'endDate'>,
  referenceDate?: string | Date
): boolean => getEventStatus(event, referenceDate) === 'ongoing';

export const formatEventDate = (
  iso: string,
  placeholder?: boolean,
  endIso?: string
): string => {
  if (placeholder) return 'Date TBD';
  const formatDatePart = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const startFormatted = formatDatePart(iso);
  if (!endIso || endIso === iso) return startFormatted;
  const endFormatted = formatDatePart(endIso);
  return `${startFormatted} – ${endFormatted}`;
};
