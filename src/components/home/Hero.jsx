import React from 'react';
import Carousel from './Carousel';

const Hero = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="home">
      <p className="hero-eyebrow">Award-winning Indian Wedding Photography</p>
      <h1 className="hero-title">
        Capturing your wedding's <em><span className="uw">magic</span></em>,<br />
        one moment at a time
      </h1>
      <p className="hero-sub">
        Preserving the love, joy, and emotion of your most special day — timeless memories to cherish forever.
      </p>

      <Carousel />

      <div className="hero-cta">
        <button className="btn-primary" onClick={() => scrollTo('gallery')}>View Our Work</button>
        <button className="btn-ghost" onClick={() => scrollTo('pricing')}>See Packages</button>
      </div>
    </section>
  );
};

export default Hero;
