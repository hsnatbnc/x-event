const CAPABILITIES = [
  {
    idx: '01',
    title: 'Strategy',
    bold: 'We design experiences with purpose.',
    copy: 'By analyzing your brand objectives and uncovering real audience insights, we craft the right message with the right approach. Every project starts with a strong strategic foundation and ends with measurable impact.'
  },
  {
    idx: '02',
    title: 'Creative',
    bold: 'We turn ideas into unforgettable moments.',
    copy: 'We bring your brand story to life through stagecraft, content, and storytelling. Inspired by culture, trends, and multidisciplinary arts, we create experiences that are not only seen but truly felt.'
  },
  {
    idx: '03',
    title: 'Technology',
    bold: 'Powered by cutting-edge technology.',
    copy: 'From lighting, sound, and LED systems to interactive solutions, XR, and mapping — we use the latest technologies to elevate experiences into immersive environments. For us, technology is not just a tool, but an integral part of the creative vision.'
  },
  {
    idx: '04',
    title: 'Production',
    bold: 'From concept to execution — flawlessly delivered.',
    copy: 'We manage every aspect of production end-to-end, including stage, lighting, sound, décor, and operations. From large-scale productions to boutique experiences, we deliver every detail with precision and excellence.'
  }
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="scene capabilities" aria-label="How We Work?">
      <div className="cap-pin">
        <p className="scene__marker">
          <span>04</span>&nbsp;/&nbsp;How We Work?
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
            We analyze your needs based on your expectations, and transform insights into creative, innovative, and impactful solutions—delivered with precision.
          </p>
        </div>

        <div className="cap-stack">
          {CAPABILITIES.map((cap) => (
            <article className="cap-row" key={cap.idx}>
              <span className="cap-row__idx">{cap.idx}</span>
              <h3 className="cap-row__title">{cap.title}</h3>
              <p className="cap-row__bold"><strong>{cap.bold}</strong></p>
              <p className="cap-row__copy">{cap.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
