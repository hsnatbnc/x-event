export default function Contact() {
  return (
    <section id="contact" className="scene contact" aria-label="Contact">
      <p className="scene__marker">
        <span>06</span>&nbsp;/&nbsp;Contact Us
      </p>

      <div className="scene__inner contact__inner">
        <div className="contact__body">
          <div>
            <h2 className="contact__kicker">
              <span className="js-mask">
                <span>If your next</span>
              </span>{" "}
              <span className="js-mask">
                <span>big idea is ready,</span>
              </span>{" "}
              <span className="js-mask">
                <span>
                  we&apos;re <em>ready too.</em>
                </span>
              </span>
            </h2>
            <a
              href="mailto:sercan@x-event.com.tr"
              className="contact__cta js-rise"
              style={{ marginTop: "2.5rem" }}
            >
              <span className="contact__cta-glyph">&#8594;</span>
              Start a project
            </a>
          </div>

          <div className="contact__details">
            <div className="contact__detail js-rise">
              <h4>Email</h4>
              <p>
                <a href="mailto:sercan@x-event.com.tr">sercan@x-event.com.tr</a>
              </p>
            </div>
            <div className="contact__detail js-rise">
              <h4>Phone</h4>
              <p>
                <a href="tel:+905334048026">+90 (533) 404 80 26</a>
              </p>
            </div>
            <div className="contact__detail js-rise">
              <h4>Follow</h4>
              <p>
                <a
                  href="https://www.instagram.com/xeventmanagement?igsh=ZDEycXByM2cwdHhn"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Instagram
                </a>
              </p>
            </div>
          </div>
        </div>

        <footer className="contact__foot">
          <span>2026 &copy; X Event &mdash; Interactive Experience Studio</span>
        </footer>
      </div>
    </section>
  );
}
