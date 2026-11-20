import { Fragment } from 'react';

/**
 * Renders text that sits inside an `text-transform: uppercase` element without
 * corrupting the "µ" (micro sign). CSS uppercases U+00B5 to the Greek capital
 * letter Mu, which reads as "M" — so µ is wrapped in a span that opts out.
 */
export const Caps = ({ children }: { children: string }) => (
  <span>
    {children.split('µ').map((part, i, all) => (
      <Fragment key={i}>
        {part}
        {i < all.length - 1 && <span className="mu">µ</span>}
      </Fragment>
    ))}
  </span>
);
