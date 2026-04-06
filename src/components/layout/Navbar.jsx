import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <a className="logo" href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
        Capture<span>Life Photography</span>
      </a>
      <ul className="nav-links">
        <li><a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}>Gallery</a></li>
        <li><a href="#videos" onClick={(e) => { e.preventDefault(); scrollToSection('videos'); }}>Videos</a></li>
        <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
        <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Stories</a></li>
        <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
      </ul>
      <button className="btn-nav" onClick={() => scrollToSection('contact')}>Reserve Now</button>
    </nav>
  );
};

export default Navbar;
