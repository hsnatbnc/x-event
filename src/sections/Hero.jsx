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
            A creative production &amp; interactive experience studio.
            We pair cinematic storytelling with WebGL craft to make
            ambitious brands unmissable.
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
