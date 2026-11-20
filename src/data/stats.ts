/**
 * Community statistics.
 *
 * `value: null` means the figure has not been verified yet — the UI shows a
 * placeholder instead of a number. NEVER put an estimate here.
 *
 * The `suffix` field is appended after the animated counter value.
 * Use `'+'` for approximate/minimum figures.
 */
export interface Stat {
  id: string;
  label: string;
  value: number | null;
  suffix?: string;
  note?: string;
}

export const STATS: Stat[] = [
  { id: 'members', label: 'Community members', value: 1090, suffix: '+' },
  { id: 'interest', label: 'Interest groups', value: 4, suffix: '+' },
  { id: 'karma', label: 'Karma mined', value: 643350, suffix: '+' },
  { id: 'rank', label: 'µLearn Rank', value: 7, suffix: '+' },
];
