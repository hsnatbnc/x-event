export default function Studio() {
  return (
    <section id="about" className="scene studio" aria-label="Studio">
      <p className="scene__marker">
        <span>03</span>&nbsp;/&nbsp;The studio
      </p>

      <div className="scene__inner studio__inner">
        <div className="studio__intro">
          <div>
            <p className="eyebrow js-fade" style={{ marginBottom: '1.5rem' }}>
              Who we are
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
              X Event is a Turkey-based studio where designers, 3D artists,
              motion directors and engineers share one workflow — so
              concepts move from first spark to final delivery with
              clarity, consistency and craft.
            </p>
            <p className="studio__body js-rise" style={{ marginTop: '1.5rem' }}>
              We don’t chase trends. We build distinctive digital experiences
              that represent each brand clearly, connect with the right
              audience, and stay memorable long after the first interaction.
            </p>
          </div>
        </div>

        <div className="studio__grid">
          <article className="studio__card js-rise">
            <h3>Who we work with</h3>
            <p>
              Brands, agencies and future-focused teams who want more than
              standard digital output.
            </p>
          </article>

          <article className="studio__card js-rise">
            <h3>Standard of craft</h3>
            <p>
              A quality bar shaped by internationally recognized digital
              craftsmanship and high production value.
            </p>
          </article>

          <article className="studio__card js-rise">
            <h3>Writing</h3>
            <ul>
              <li>Brand experience case studies</li>
              <li>Interactive campaign highlights</li>
              <li>Digital production insights</li>
            </ul>
          </article>

          <article className="studio__card js-rise">
            <h3>Talks</h3>
            <ul>
              <li>Design &amp; experience events</li>
              <li>Creative technology conferences</li>
              <li>Interactive production talks</li>
              <li>Brand innovation panels</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
