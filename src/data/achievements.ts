/**
 * Community achievements.
 *
 * Intentionally empty of invented content: add only verified achievements.
 * While the list is empty (or marked placeholder) the About page shows a clearly
 * labelled placeholder instead of made-up milestones.
 */
export interface Achievement {
  id: string;
  /** e.g. '2025' — free text so a season or term also works */
  when: string;
  title: string;
  description: string;
  placeholder?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ph-ach-1',
    when: 'Year',
    title: 'Achievement to be added',
    description: 'A short, verified description of the milestone goes here.',
    placeholder: true,
  },
  {
    id: 'ph-ach-2',
    when: 'Year',
    title: 'Achievement to be added',
    description: 'A short, verified description of the milestone goes here.',
    placeholder: true,
  },
  {
    id: 'ph-ach-3',
    when: 'Year',
    title: 'Achievement to be added',
    description: 'A short, verified description of the milestone goes here.',
    placeholder: true,
  },
];
