export default function Hero() {
  return (
    <section id="home" className="scene hero">
      <div className="scene__inner hero__inner">
        <div className="hero__footer">
          <div className="hero__tag js-rise">
            <span
              className="hero__coord"
              style={{ marginBottom: "0.6em", display: "block" }}
            >
              Who we are?
            </span>
            X Event combines 15+ years of industry expertise with a bold, modern
            mindset to deliver distinctive experiences that inspire and perform.
          </div>
          <a className="hero__scroll js-rise" href="#manifesto">
            Scroll to enter
            <span className="hero__scroll-line" />
          </a>
        </div>
      </div>
    </section>
  );
}
