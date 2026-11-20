import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from './Button';
import { TLink } from './PageTransition';
import { NAV_ITEMS } from '../data/site';

export const Nav = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll + Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = (to: string) => (pathname === to ? 'page' : undefined);

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav__inner">
          <Logo onClick={() => setOpen(false)} />

          <nav className="nav__links" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <TLink key={item.to} to={item.to} className="nav__link" aria-current={current(item.to)}>
                {item.label}
              </TLink>
            ))}
          </nav>

          <div className="nav__cta">
            <Button to="/join" small>
              Join µLearn
            </Button>
          </div>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        {[...NAV_ITEMS, { label: 'Join µLearn', to: '/join' }].map((item, i) => (
          <TLink
            key={item.to}
            to={item.to}
            className="mobile-menu__link"
            aria-current={current(item.to)}
            tabIndex={open ? 0 : -1}
            style={{ ['--i' as string]: i }}
          >
            {item.label}
          </TLink>
        ))}
      </div>
    </>
  );
};
