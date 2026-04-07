import React, { useState, useEffect } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { loginAdmin, verifyAuth } from '../services/api';

import AdminCarousel from '../components/admin/AdminCarousel';
import AdminGallery from '../components/admin/AdminGallery';
import AdminVideos from '../components/admin/AdminVideos';
import AdminPricing from '../components/admin/AdminPricing';
import AdminAbout from '../components/admin/AdminAbout';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState('carousel');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const res = await verifyAuth();
          if (res && res.success) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('adminToken');
          }
        } catch (err) {
          localStorage.removeItem('adminToken');
        }
      }
      setIsVerifying(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin(password);
      if (res.success && res.token) {
        localStorage.setItem('adminToken', res.token);
        setIsAuthenticated(true);
        setError('');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Invalid password or server error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setPassword('');
    setError('');
  };

  if (isVerifying) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cream2)', color: 'var(--brown)' }}>
        <Loader2 size={48} className="animate-spin" style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p style={{ opacity: 0.6, fontSize: '0.9rem', letterSpacing: '0.05em' }}>Verifying Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--cream2)' }}>
        <div style={{ background: 'var(--cream)', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid var(--brown3)' }}>
          <Lock size={48} color="var(--red)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--brown)', marginBottom: '1.5rem', fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem' }}>Admin Access</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '14px', border: '1px solid var(--brown2)', 
                borderRadius: '8px', marginBottom: '1rem', outline: 'none', fontSize: '1rem',
                backgroundColor: 'rgba(255,255,255,0.8)'
              }}
            />
            {error && <p style={{ color: 'var(--red)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>{error}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-root" style={{ minHeight: '100vh', padding: '3rem 5%', color: 'var(--brown)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(242,232,213,0.2)', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', margin: 0 }}>Dashboard</h1>
          <p style={{ opacity: 0.7, marginTop: '0.5rem' }}>Manage your portfolio content via MongoDB Atlas.</p>
        </div>
        <button onClick={handleLogout} className="btn-ghost">Logout</button>
      </header>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        <button onClick={() => setActiveTab('carousel')} className={activeTab === 'carousel' ? 'btn-primary' : 'btn-ghost'}>🖼 Carousel</button>
        <button onClick={() => setActiveTab('gallery')} className={activeTab === 'gallery' ? 'btn-primary' : 'btn-ghost'}>📂 Albums</button>
        <button onClick={() => setActiveTab('videos')} className={activeTab === 'videos' ? 'btn-primary active-tab' : 'btn-ghost'}>🎬 Videos</button>
        <button onClick={() => setActiveTab('pricing')} className={activeTab === 'pricing' ? 'btn-primary active-tab' : 'btn-ghost'}>💰 Pricing</button>
        <button onClick={() => setActiveTab('about')} className={activeTab === 'about' ? 'btn-primary active-tab' : 'btn-ghost'}>👤 About</button>
      </div>

      <main>
        {activeTab === 'carousel' && <AdminCarousel />}
        {activeTab === 'gallery' && <AdminGallery />}
        {activeTab === 'videos' && <AdminVideos />}
        {activeTab === 'pricing' && <AdminPricing />}
        {activeTab === 'about' && <AdminAbout />}
      </main>

    </div>
  );
};

export default Admin;
