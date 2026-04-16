import { useState } from 'react';
import { PROJECTS } from '../data/projects.js';
import ProjectModal from '../components/ProjectModal.jsx';

export default function Projects() {
  const [openProject, setOpenProject] = useState(null);

  return (
    <section id="projects" className="scene projects" aria-label="Selected projects">
      <p className="scene__marker">
        <span>05</span>&nbsp;/&nbsp;Selected work
      </p>

      <div className="scene__inner">
        <div className="projects__head">
          <h2 className="display projects__title">
            <span className="js-mask">
              <span>Selected</span>
            </span>{' '}
            <span className="js-mask">
              <span>
                <em>work.</em>
              </span>
            </span>
          </h2>
          <p className="lead projects__lead js-rise">
            A range of X Event projects across event production, stage design,
            live performance, and creative direction — each built to carry a
            brand further than the brief asked for.
          </p>
        </div>

        <div className="projects__grid">
          {PROJECTS.map((proj, i) => (
            <article className="work-card" key={proj.id}>
              <button
                className="work-card__thumb"
                type="button"
                aria-label={`Play video: ${proj.title}`}
                onClick={() => setOpenProject(proj)}
              >
                <img
                  src={`https://img.youtube.com/vi/${proj.youtube}/hqdefault.jpg`}
                  alt=""
                  loading={i < 4 ? 'eager' : 'lazy'}
                  draggable="false"
                />
                <span className="work-card__play" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                    <path d="M19 15.5L34 24L19 32.5V15.5Z" fill="currentColor" />
                  </svg>
                </span>
              </button>

              <div className="work-card__body">
                <h3 className="work-card__title">{proj.title}</h3>
                <p className="work-card__desc">
                  {proj.description.length > 90
                    ? proj.description.slice(0, 90) + '... '
                    : proj.description}
                  {proj.description.length > 90 && (
                    <button
                      type="button"
                      className="work-card__more"
                      onClick={() => setOpenProject(proj)}
                    >
                      read more
                    </button>
                  )}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="projects__invite js-rise">
          <em>If</em> you have a bold event idea,
          <br />X Event can turn it into an unforgettable experience.
        </p>
      </div>

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
}
