/** What µLearn CHN offers — shared by the Home accordion and the About page. */
export interface Offering {
  id: 'peer' | 'skill' | 'work' | 'collab' | 'mentor';
  title: string;
  text: string;
}

export const OFFERINGS: Offering[] = [
  {
    id: 'peer',
    title: 'Peer learning',
    text: 'Learn from the people sitting next to you. Members teach, question and learn alongside each other — no one is just an audience.',
  },
  {
    id: 'skill',
    title: 'Skill development',
    text: 'Hands-on practice in technical and creative skills, at your own pace, with a community that keeps you moving.',
  },
  {
    id: 'work',
    title: 'Workshops',
    text: 'Practical sessions run by and for students — learn a tool, try it immediately, and leave with something working.',
  },
  {
    id: 'collab',
    title: 'Collaborative projects',
    text: 'Build real things in teams and learn what collaboration actually takes: planning, feedback, shipping.',
  },
  {
    id: 'mentor',
    title: 'Mentorship & networking',
    text: 'Meet seniors, mentors and fellow learners across the wider µLearn network, and find people to grow with.',
  },
];
