import React, { useState, useEffect } from 'react';
import { getAbout } from '../services/api';

const SocialIcon = ({ d, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const InstagramIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const LinkedinIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const WhatsAppIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const About = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await getAbout();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error('Failed to fetch about data');
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#efc1c8' }}>
        <p>Designing the experience...</p>
      </div>
    );
  }

  if (!data || !data.name) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#efc1c8' }}>
        <p>No biography available yet. Please check back later.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '120px 5% 80px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        
        {/* Profile Image Section */}
        <div style={{ position: 'relative' }}>
          <div style={{ 
            width: '100%', 
            aspectRatio: '4/5', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            border: '1px solid rgba(183, 110, 121, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            {data.profileImage ? (
              <img src={data.profileImage} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#1a0b1a', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                [ Profile Image ]
              </div>
            )}
          </div>
          {/* Decorative Elements */}
          <div style={{ 
            position: 'absolute', 
            top: '-20px', 
            left: '-20px', 
            width: '100px', 
            height: '100px', 
            borderLeft: '4px solid #b76e79', 
            borderTop: '4px solid #b76e79', 
            borderRadius: '10px 0 0 0',
            zIndex: -1 
          }} />
          <div style={{ 
            position: 'absolute', 
            bottom: '-20px', 
            right: '-20px', 
            width: '100px', 
            height: '100px', 
            borderRight: '4px solid #efc1c8', 
            borderBottom: '4px solid #efc1c8', 
            borderRadius: '0 0 10px 0',
            zIndex: -1 
          }} />
        </div>

        {/* Text Section */}
        <div style={{ color: 'var(--brown)' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            letterSpacing: '0.3em', 
            textTransform: 'uppercase', 
            color: '#b76e79', 
            display: 'block', 
            marginBottom: '1rem' 
          }}>
            Meet The Artist
          </span>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            lineHeight: 1.1, 
            marginBottom: '2rem',
            color: '#efc1c8'
          }}>
            {data.name}
          </h1>
          
          <div style={{ 
            fontSize: '1.1rem', 
            lineHeight: 1.8, 
            opacity: 0.85, 
            whiteSpace: 'pre-wrap', 
            marginBottom: '3rem' 
          }}>
            {data.bio}
          </div>

          <div style={{ borderTop: '1px solid rgba(183, 110, 121, 0.2)', paddingTop: '2rem' }}>
            <p style={{ marginBottom: '1.5rem', fontWeight: '500', color: '#b76e79' }}>Connect with me</p>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              {data.socials?.instagram && (
                <a href={data.socials.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brown)', transition: '0.3s' }}>
                  <InstagramIcon size={28} />
                </a>
              )}
              {data.socials?.facebook && (
                <a href={data.socials.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brown)', transition: '0.3s' }}>
                  <FacebookIcon size={28} />
                </a>
              )}
              {data.socials?.twitter && (
                <a href={data.socials.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brown)', transition: '0.3s' }}>
                  <TwitterIcon size={28} />
                </a>
              )}
              {data.socials?.linkedin && (
                <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brown)', transition: '0.3s' }}>
                  <LinkedinIcon size={28} />
                </a>
              )}
              {data.socials?.whatsapp && (
                <a href={`https://wa.me/${data.socials.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brown)', transition: '0.3s' }}>
                  <WhatsAppIcon size={28} />
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;

