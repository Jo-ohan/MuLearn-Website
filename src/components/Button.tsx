import type { ReactNode } from 'react';
import { TLink } from './PageTransition';

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

interface ButtonProps {
  children: ReactNode;
  /** Internal route */
  to?: string;
  /** External URL. An empty string renders a clearly disabled "link pending" state. */
  href?: string;
  onClick?: () => void;
  variant?: 'light' | 'dark' | 'ghost';
  small?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

/**
 * Premium subtle button. On hover, a soft ambient glow appears, the background
 * brightens slightly, and the arrow icon slides horizontally by ~4px.
 * Text remains stationary. Pressing it nudges inward.
 * The hover choreography is gated to hover-capable pointers.
 */
export const Button = ({
  children,
  to,
  href,
  onClick,
  variant = 'light',
  small,
  className = '',
  type = 'button',
}: ButtonProps) => {
  const cls = `btn ${variant === 'dark' ? 'btn--dark' : ''} ${variant === 'ghost' ? 'btn--ghost' : ''} ${small ? 'btn--small' : ''} ${className}`;

  const inner = (
    <>
      <span className="btn__label">
        <span>{children}</span>
      </span>
      <span className="btn__icon">
        <Arrow />
      </span>
    </>
  );

  let node: ReactNode;
  if (to) {
    node = (
      <TLink to={to} className={cls}>
        {inner}
      </TLink>
    );
  } else if (href === '') {
    node = (
      <button
        type="button"
        className={cls}
        aria-disabled="true"
        title="Official link not added yet"
        onClick={(e) => e.preventDefault()}
      >
        {inner}
      </button>
    );
  } else if (href) {
    node = (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  } else {
    node = (
      <button type={type} className={cls} onClick={onClick}>
        {inner}
      </button>
    );
  }

  return (
    <span className="magnetic" data-magnetic>
      {node}
    </span>
  );
};
