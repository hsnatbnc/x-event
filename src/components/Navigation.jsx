export default function Navigation() {
  return (
    <header className="nav nav--home">
      <a href="#home" className="nav__mark" aria-label="X Event — home">
        <span className="nav__glyph">x</span>
        <span>X&nbsp;Event&nbsp;/&nbsp;Studio</span>
      </a>

      <nav className="nav__links" aria-label="Primary">
        <a href="#home">Home</a>
        <a href="#about">EVENT ECOSYSTEM</a>
        <a href="#projects">PROJECTS</a>
        <a href="#contact">Contact</a>
      </nav>

      <a href="#contact" className="nav__cta">
        Start a project
        <span aria-hidden="true">→</span>
      </a>
    </header>
  );
}
