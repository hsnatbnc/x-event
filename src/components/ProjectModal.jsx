import { useEffect, useRef } from 'react';

/**
 * ProjectModal
 * ------------------------------------------------
 * Accessible, keyboard-friendly dialog that opens
 * a YouTube embed for a project. The modal tries to
 * feel like an extension of the Archive world, not a
 * pasted-in lightbox — hence the glass frame and the
 * luminous edge.
 *
 * Behaviour:
 *   - ESC closes
 *   - Click on backdrop closes
 *   - Close button closes and is focused on open
 *   - `inert`-like body scroll lock while open
 *   - iframe is torn down on close so audio stops
 */
export default function ProjectModal({ project, onClose }) {
  const closeBtnRef = useRef(null);
  const dialogRef = useRef(null);
  const open = !!project;

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Shift focus to the close button so ESC / Enter just work
    const raf = requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      // Simple focus trap — keep tab inside the dialog
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const src = `https://www.youtube-nocookie.com/embed/${project.youtube}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div
      className="pxmodal"
      role="presentation"
      onMouseDown={(e) => {
        // Close only when click starts on the backdrop itself, not on the
        // dialog — prevents drag-releases inside the dialog from closing it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="pxmodal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pxmodal-title"
        aria-describedby="pxmodal-desc"
      >
        <header className="pxmodal__head">
          <div>
            <h2 id="pxmodal-title" className="pxmodal__title">
              {project.title}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="pxmodal__close"
            aria-label="Close project"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="pxmodal__video">
          <iframe
            key={project.id}
            src={src}
            title={`${project.title} — video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="eager"
          />
        </div>

        <footer className="pxmodal__foot">
          <p className="pxmodal__desc">{project.description}</p>
        </footer>
      </div>
    </div>
  );
}
