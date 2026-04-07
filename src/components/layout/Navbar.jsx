import React, { useState, useEffect } from 'react';
// lucide-react might be missing some exports in the current version, so we'll use SVGs for socials

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
        Abhay<span>Photography</span>
      </a>
      <ul className="nav-links">
        <li><a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}>Gallery</a></li>
        <li><a href="#videos" onClick={(e) => { e.preventDefault(); scrollToSection('videos'); }}>Videos</a></li>
        <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
        <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Stories</a></li>
        <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="https://instagram.com/aks_shutterup_photography" target="_blank" rel="noreferrer" style={{ color: 'var(--brown)', opacity: 0.7, transition: 'opacity 0.2s', display: 'flex' }} onMouseOver={(e)=>e.currentTarget.style.opacity=1} onMouseOut={(e)=>e.currentTarget.style.opacity=0.7}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://wa.me/919302049601" target="_blank" rel="noreferrer" style={{ color: 'var(--brown)', opacity: 0.7, transition: 'opacity 0.2s', display: 'flex' }} onMouseOver={(e)=>e.currentTarget.style.opacity=1} onMouseOut={(e)=>e.currentTarget.style.opacity=0.7}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
        </div>
        <button className="btn-nav" onClick={() => scrollToSection('contact')}>Reserve Now</button>
      </div>
    </nav>
  );
};

export default Navbar;
