const QUOTE = [
  'We',
  'don’t',
  'decorate',
  'the',
  'screen.',
  'We',
  'compose',
  'it —',
  'scene',
  'by',
  'scene,',
  'so',
  'every',
  'scroll',
  'becomes',
  'a',
  'moment',
  'you',
  'can’t',
  'look',
  'away',
  'from.'
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
            <span className="js-fade">A brand film in six scenes</span>
            <span className="js-fade">Read slowly</span>
          </div>
        </div>
      </section>
    </div>
  );
}
