import { useEffect, useRef, useState } from 'react';
import Navigation from './components/Navigation.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import AtmosphereCanvas from './three/AtmosphereCanvas.jsx';
import Hero from './sections/Hero.jsx';
import Manifesto from './sections/Manifesto.jsx';
import Studio from './sections/Studio.jsx';
import Capabilities from './sections/Capabilities.jsx';
import Projects from './sections/Projects.jsx';
import Contact from './sections/Contact.jsx';
import setupScrollStory from './motion/scrollStory.js';

export default function HomeApp() {
  const progressRef = useRef({ value: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ctx = setupScrollStory({ progressRef });
    setReady(true);
    return () => ctx && ctx.revert && ctx.revert();
  }, []);

  return (
    <>
      <AtmosphereCanvas progressRef={progressRef} />
      <ScrollProgress />
      <Navigation />
      <main className={`story ${ready ? 'is-ready' : ''}`}>
        <Hero />
        <Manifesto />
        <Studio />
        <Capabilities />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
