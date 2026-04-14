const MARQUEE = [
  'AI Launch Experience',
  'Heritage Brand Platform',
  'AI Product Showcase',
  'Luxury Motion Film',
  'Synthetic Human Interface',
  'Conference Digital Experience',
  'Web3 Marketplace Platform',
  'Interactive Play World',
  'Technology Brand Launch',
  'Spatial Fusion Experience',
  'Interactive Data Globe',
  'X Event Lab Platform',
  'Storybook Experience',
  'AR Beverage Activation',
  'Digital Fashion Experience',
  'Immersive Performance Platform'
];

const FEATURED = [
  {
    idx: '01',
    title: 'AI Product Showcase',
    body:
      'A clean, future-facing website for an AI technology company — built around product storytelling, user engagement and a sleek presentation approach.',
    tags: ['Concept', 'Web design', 'WebGL', '3D design']
  },
  {
    idx: '02',
    title: 'Luxury Motion Film',
    body:
      'A CG-driven short film for a premium automotive campaign. A four-stage visual journey told through digital art, motion design and cinematic compositing — built for large-format presentation.',
    tags: ['Creative concept', '3D design', 'Motion', 'Compositing']
  },
  {
    idx: '03',
    title: 'X Event Lab Platform',
    body:
      'Our internal R&D platform — a dedicated space for ongoing research, new technical ideas and future-facing creative exploration, designed for clients and partners.',
    tags: ['Concept', 'Web design', 'WebGL', '3D design']
  }
];

export default function Projects() {
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
                <em>projects.</em>
              </span>
            </span>
          </h2>
          <p className="lead projects__lead js-rise">
            A range of X Event projects across concept, web design,
            development, 3D, animation, AR and Web3 — each built to carry a
            brand further than the brief asked for.
          </p>
        </div>

        <div className="projects__marquee js-fade" aria-hidden="true">
          <div className="projects__marquee-track">
            {MARQUEE.concat(MARQUEE).map((item, i) => (
              <span className="projects__marquee-item" key={`${item}-${i}`}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="projects__featured">
          {FEATURED.map((proj) => (
            <article className="project-card js-rise" key={proj.idx}>
              <span className="project-card__idx">Case · {proj.idx}</span>
              <h3 className="project-card__title">{proj.title}</h3>
              <p className="project-card__body">{proj.body}</p>
              <div className="project-card__meta">
                {proj.tags.map((t) => (
                  <span className="project-card__tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="projects__invite js-rise">
          <em>If</em> you have a bold digital idea,
          <br />X Event can turn it into an immersive experience.
        </p>
      </div>
    </section>
  );
}
