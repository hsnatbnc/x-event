const QUOTE = [
  'We',
  'don’t',
  'create',
  'events',
  'we,',
  'create',
  'meaning',
  'and',
  'impact.'
];

export default function Manifesto() {
  return (
    <div className="manifesto__track">
      <section id="manifesto" className="scene manifesto" aria-label="Manifesto">
        <p className="scene__marker">
          <span>02</span>&nbsp;/&nbsp;Manifesto
        </p>
        <div className="scene__inner manifesto__inner">
          <p className="manifesto__quote" aria-label={QUOTE.join(' ')}>
            {QUOTE.map((w, i) => (
              <span className="word" key={i}>
                {w}&nbsp;
              </span>
            ))}
          </p>
          <div className="manifesto__footnote">
            <span className="js-fade">Where Experience Meets Perspective</span>
          </div>
        </div>
      </section>
    </div>
  );
}
