/**
 * Photo gallery ("Memories"). Add genuine photographs to `public/memories/`
 * and list them here. Items without `src` render a neutral placeholder tile.
 */
export interface Memory {
  id: string;
  caption: string;
  src?: string;
  alt?: string;
  /** Layout hint for the editorial grid. */
  size: 'tall' | 'wide' | 'square';
}

export const MEMORIES: Memory[] = [
  { id: 'm1', caption: 'Exodia', src: 'https://res.cloudinary.com/dsyus516r/image/upload/v1793550439/IMG_5086_tm6kwh.jpg', size: 'wide' },
  { id: 'm2', caption: '', src: 'https://res.cloudinary.com/dsyus516r/image/upload/v1793550439/IMG_7789_qyh10e.jpg', size: 'wide' },
  { id: 'm3', caption: '', src: 'https://res.cloudinary.com/dsyus516r/image/upload/v1793550438/IMG_7834_xrr7b7.jpg', size: 'square' },
  { id: 'm4', caption: '', src: 'https://res.cloudinary.com/dsyus516r/image/upload/v1793550438/IMG_7844_lclzmf.jpg', size: 'wide' },
  { id: 'm5', caption: 'Intro to Figma', src: 'https://res.cloudinary.com/dsyus516r/image/upload/v1793550438/IMG_9798_mvknx7.jpg', size: 'square' },
];
