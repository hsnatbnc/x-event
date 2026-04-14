export default function Contact() {
  return (
    <section id="contact" className="scene contact" aria-label="Contact">
      <p className="scene__marker">
        <span>06</span>&nbsp;/&nbsp;Closing scene
      </p>

      <div className="scene__inner contact__inner">
        <div>
          <p className="eyebrow eyebrow--ember js-fade" style={{ marginBottom: '1.5rem' }}>
            Let’s build something
          </p>
          <h2 className="contact__kicker">
            <span className="js-mask">
              <span>If your next</span>
            </span>{' '}
            <span className="js-mask">
              <span>big idea is ready,</span>
            </span>{' '}
            <span className="js-mask">
              <span>
                we’re <em>ready too.</em>
              </span>
            </span>
          </h2>
          <a
            href="mailto:hello@xevent.studio"
            className="contact__cta js-rise"
            style={{ marginTop: '2.5rem' }}
          >
            <span className="contact__cta-glyph">→</span>
            Start a project
          </a>
        </div>

        <div className="contact__details">
          <div className="contact__detail js-rise">
            <h4>Based in</h4>
            <p>Turkey · Studio + remote collaboration worldwide</p>
          </div>
          <div className="contact__detail js-rise">
            <h4>New business</h4>
            <p>
              <a href="mailto:new@xevent.studio">new@xevent.studio</a>
            </p>
          </div>
          <div className="contact__detail js-rise">
            <h4>General</h4>
            <p>
              <a href="mailto:hello@xevent.studio">hello@xevent.studio</a>
            </p>
          </div>
          <div className="contact__detail js-rise">
            <h4>Follow</h4>
            <p>
              <a href="#">Instagram</a>&nbsp;·&nbsp;
              <a href="#">LinkedIn</a>&nbsp;·&nbsp;
              <a href="#">X / Twitter</a>
            </p>
          </div>
        </div>

        <footer className="contact__foot">
          <span>© X Event — Interactive Experience Studio</span>
          <span>Scene VI · End</span>
        </footer>
      </div>
    </section>
  );
}
