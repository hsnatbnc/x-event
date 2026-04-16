const services = [
  {
    title: 'Global Conferences & Summits',
    desc: 'High-level executive gatherings and international meetings with impeccable production and guest experience.',
    tags: ['EXECUTIVE EVENTS', 'STAGE DESIGN', 'AV'],
  },
  {
    title: 'Sports Events & Tournament Production',
    desc: 'Major sporting events, tournaments and live broadcasts on a grand scale.',
    tags: ['SPORTS', 'BROADCAST', 'SHOW FLOW'],
  },
  {
    title: 'Turnkey Logistics',
    desc: 'Talent booking, VIP transport, and full-service event logistics.',
    tags: ['TALENT', 'LOGISTICS', 'HOSPITALITY'],
  },
  {
    title: 'Artist Management',
    desc: 'End to end artist operations management, covering booking, contracts, technical riders, transfers, accommodation, and show-day coordination.',
    tags: ['Techinical riders', 'Booking', 'Contracts'],
  },
];

export default function Studio() {
  return (
    <section id="about" className="scene studio" aria-label="Event Ecosystem">
      <p className="scene__marker">
        <span>03</span>&nbsp;/&nbsp;EVENT ECOSYSTEM
      </p>

      <div className="scene__inner studio__inner">
        <div className="studio__intro">
          <div>
            <p className="eyebrow js-fade" style={{ marginBottom: '1.5rem' }}>
              Immersive Event Ecosystems <br/>Turnkey Global Production
            </p>
            <h2 className="display studio__heading">
              <span className="js-mask">
                <span>A production house</span>
              </span>{' '}
              <span className="js-mask">
                <span>
                  for <em>ambitious</em> ideas.
                </span>
              </span>
            </h2>
          </div>

          <div>
            <p className="studio__lead js-rise">
             From global conferences and stadium-scale tournaments to immersive brand worlds, X-Event delivers end-to-end event ecosystems - strategy, production, broadcast, logistics and flawless execution, all under one roof.

            </p>
            <p className="studio__body js-rise" style={{ marginTop: '1.5rem' }}>
              At X-Event, we transform ambitious ideas into unforgettable live experiences, seamlessly produced, globally scalable, and built to move people.
            </p>
          </div>
        </div>

        <div className="studio__grid">
          {services.map((s, i) => (
            <article key={i} className="svc js-rise">
              <div className="svc__body">
                <h3 className="svc__title">{s.title}</h3>
                <p className="svc__desc">{s.desc}</p>
                <div className="svc__tags">
                  {s.tags.map((t, j) => (
                    <span key={j} className="svc__tag">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
