import React, { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import GalleryGrid from '../components/gallery/GalleryGrid';
import VideoGrid from '../components/home/VideoGrid';
import { fetchPricing } from '../services/mockApi';

const fallbackPricing = [
  {
    tag: "Essential", name: "Silver", price: "₹45,000", per: "one occasion",
    features: ["1 Occasion coverage", "300 edited photos", "Online gallery access", "2 photographers", "4-week delivery"],
    buttonText: "Book Silver", featured: false
  },
  {
    tag: "Most Popular", name: "Gold", price: "₹1,10,000", per: "3 occasions",
    features: ["Haldi + Mehendi + Reception", "800+ edited photos", "Cinematic highlight reel", "3 photographers", "Premium album (40 pages)", "3-week delivery"],
    buttonText: "Book Gold — Best Value", featured: true
  },
  {
    tag: "Complete", name: "Diamond", price: "₹1,85,000", per: "full wedding",
    features: ["All occasions + pre-wedding", "Unlimited edited photos", "Full cinematic film (15 min)", "5 photographers + drone", "Luxury album (60 pages)", "Same-day edit teaser", "2-week priority delivery"],
    buttonText: "Book Diamond", featured: false
  }
];

const Home = () => {
  const [pricing, setPricing] = useState(fallbackPricing);

  useEffect(() => {
    const loadPricing = async () => {
      const res = await fetchPricing();
      if (res && res.success && res.data && res.data.length > 0) {
        setPricing(res.data);
      }
    };
    loadPricing();
  }, []);

  return (
    <>
      <Hero />
      <GalleryGrid />
      
      {/* Videos Section */}
      <VideoGrid />
      
      {/* Testimonials */}
      <section className="testi-section" id="testimonials">
        <p className="section-label">Love stories</p>
        <h2 className="section-title">What our couples say</h2>
        <div className="testi-grid">
          <div className="tcard">
            <div className="stars">★★★★★</div>
            <p className="tcard-quote">"They captured every emotion of our Haldi — the laughter, the happy tears, the chaos of colours. We relive it every time."</p>
            <p className="tcard-author">Priya &amp; Arjun Sharma</p>
            <p className="tcard-occasion">Udaipur · Feb 2024</p>
          </div>
          <div className="tcard">
            <div className="stars">★★★★★</div>
            <p className="tcard-quote">"Our Mehendi album is absolutely stunning. The candid shots feel so natural — like they were invisible, just capturing real moments."</p>
            <p className="tcard-author">Sneha &amp; Rahul Verma</p>
            <p className="tcard-occasion">Jaipur · Nov 2023</p>
          </div>
          <div className="tcard">
            <div className="stars">★★★★★</div>
            <p className="tcard-quote">"From the Reception entrance to the last dance, every frame is magazine-worthy. Worth every rupee and so much more."</p>
            <p className="tcard-author">Divya &amp; Karan Mehta</p>
            <p className="tcard-occasion">Mumbai · Jan 2024</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ background: 'var(--cream)' }}>
        <p className="section-label">Packages</p>
        <h2 className="section-title">Simple, transparent<br /><em style={{ fontFamily: "'Cormorant Garamond', serif" }}>pricing</em></h2>
        <div className="pricing-grid">
          {pricing.map((plan, i) => (
            <div key={i} className={`pcard ${plan.featured ? 'featured' : ''}`}>
              <p className="p-tag">{plan.tag}</p>
              <p className="p-name">{plan.name}</p>
              <div className="p-divider"></div>
              <p className="p-price">{plan.price}</p>
              <p className="p-per">{plan.per}</p>
              <ul className="p-features">
                {plan.features.map((feat, j) => (
                  <li key={j}>{feat}</li>
                ))}
              </ul>
              <button className="btn-pricing">{plan.buttonText}</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
