import { useEffect, useState } from 'react';

export default function Navigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav nav--home ${open ? 'is-menu-open' : ''}`}>
      <a href="#home" className="nav__mark" aria-label="X Event — home" onClick={close}>
        <span className="nav__glyph">x</span>
        <span>X&nbsp;Event&nbsp;/&nbsp;Studio</span>
      </a>

      <nav className="nav__links" aria-label="Primary">
        <a href="#home">Home</a>
        <a href="#about">EVENT ECOSYSTEM</a>
        <a href="#projects">PROJECTS</a>
        <a href="#contact">Contact</a>
      </nav>

      <a href="mailto:sercan@x-event.com.tr" className="nav__cta">
        Start a project
        <span aria-hidden="true">→</span>
      </a>

      <button
        type="button"
        className={`nav__burger ${open ? 'is-open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <div
        id="mobile-menu"
        className={`nav__mobile ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <nav className="nav__mobile-links" aria-label="Mobile">
          <a href="#home" onClick={close}>Home</a>
          <a href="#about" onClick={close}>Event Ecosystem</a>
          <a href="#projects" onClick={close}>Projects</a>
          <a href="#contact" onClick={close}>Contact</a>
        </nav>
        <a
          href="mailto:sercan@x-event.com.tr"
          className="nav__mobile-cta"
          onClick={close}
        >
          <span>Start a project</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
