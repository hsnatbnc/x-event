export default function Hero() {
  return (
    <section id="home" className="scene hero">
      <div className="scene__inner hero__inner">
        <h1 className="display hero__headline">
          <span className="line js-mask">
            <span>We build worlds</span>
          </span>
          <span className="line js-mask">
            <span>that refuse</span>
          </span>
          <span className="line js-mask">
            <span>
              to be <em>forgotten.</em>
            </span>
          </span>
        </h1>

        <div className="hero__footer">
          <p className="hero__tag js-rise">
            Who we are? <br/>
            X Event combines 15+ years of industry expertise with a bold, modern mindset to deliver distinctive experiences that inspire and perform.
          </p>
          <a className="hero__scroll js-rise" href="#manifesto">
            Scroll to enter
            <span className="hero__scroll-line" />
          </a>
        </div>
      </div>
    </section>
  );
}
