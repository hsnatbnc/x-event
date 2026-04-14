const CAPABILITIES = [
  {
    idx: '01',
    title: 'Strategy',
    copy: 'We open every project by mapping the territory — audience truths, brand ambition, technical reality. Discovery sessions and creative leadership shape the story arc and the stack before a single pixel moves. Strategy here is not a slide deck. It is the spine that keeps every later decision honest.'
  },
  {
    idx: '02',
    title: 'Creative',
    copy: 'Art direction, motion, interface and illustration live under one roof so a brand never feels stitched together. We design for atmosphere first, then layer the interactions that make a screen feel alive. Every frame is treated as a moment inside a wider visual language. Detail is where craft becomes felt.'
  },
  {
    idx: '03',
    title: 'Technology',
    copy: 'We build with WebGL, real-time engines and bespoke front-end so the work performs as cinematically as it looks. From browser pieces to room-scale installations and headset experiences, engineers ship production-grade code. Performance, accessibility and longevity are baked in from day one. Magic without fragility.'
  },
  {
    idx: '04',
    title: 'Production',
    copy: 'Procedural modeling, 3D asset pipelines, optimization and animation are handled in-house from kickoff to delivery. Production runs as a creative discipline — not a back-end service that arrives after design. Tight loops between artists and engineers keep ambition and feasibility aligned. Work ships at the quality it was promised.'
  }
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="scene capabilities" aria-label="Capabilities">
      <div className="cap-pin">
        <p className="scene__marker">
          <span>04</span>&nbsp;/&nbsp;Capabilities
        </p>

        <div className="cap-pin__head">
          <h2 className="display cap-pin__title">
            <span className="js-mask">
              <span>One pipeline.</span>
            </span>{' '}
            <span className="js-mask">
              <span>
                Four <em>disciplines.</em>
              </span>
            </span>
          </h2>
          <p className="lead cap-pin__lead js-rise">
            Strategy, creative, technology and production run as a single
            production — so ideas never lose their edge in hand-off.
          </p>
        </div>

        <div className="cap-stack">
          {CAPABILITIES.map((cap) => (
            <article className="cap-row" key={cap.idx}>
              <span className="cap-row__idx">{cap.idx}</span>
              <h3 className="cap-row__title">{cap.title}</h3>
              <p className="cap-row__copy">{cap.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
