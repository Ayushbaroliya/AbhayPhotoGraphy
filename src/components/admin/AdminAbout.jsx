import React, { useState, useEffect } from 'react';
import { getAbout, updateAbout, uploadImage } from '../../services/api';

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profileImage: '',
    profilePublicId: '',
    socials: {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      whatsapp: '',
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await getAbout();
      if (res.success && res.data) {
        setFormData(prev => ({
          ...prev,
          ...res.data,
          socials: { ...prev.socials, ...res.data.socials }
        }));
      }
    } catch (err) {
      setError('Failed to load about details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const res = await uploadImage(file, 'abhay-photography/profile');
      if (res.success) {
        setFormData(prev => ({
          ...prev,
          profileImage: res.url,
          profilePublicId: res.publicId
        }));
      }
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await updateAbout(formData);
      if (res.success) {
        setSuccess('Details updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update details');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid var(--brown2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--brown)',
    borderRadius: '8px',
    marginBottom: '1rem',
    outline: 'none'
  };

  if (loading) return <p style={{ opacity: 0.6 }}>Loading about details...</p>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '1.5rem', opacity: 0.9 }}>Photographer Details</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Profile Section */}
        <section style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(183,110,121,0.2)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#efc1c8' }}>Profile Presentation</h3>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #b76e79', background: '#000' }}>
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>No Image</div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label className="btn-ghost" style={{ display: 'inline-block', cursor: 'pointer', marginBottom: '0.5rem' }}>
                {uploading ? 'Uploading...' : '📁 Change Profile Photo'}
                <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
              </label>
              <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Recommended: Square aspect ratio (min 500x500px)</p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(183,110,121,0.2)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#efc1c8' }}>Biography</h3>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', opacity: 0.7 }}>Display Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="e.g. Abhay Pratap Singh"
            style={inputStyle}
            required
          />
          
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', opacity: 0.7 }}>Short Bio</label>
          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={handleInputChange} 
            placeholder="Describe your style, experience, and passion..."
            style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }}
            required
          />
        </section>

        {/* Socials Section */}
        <section style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(183,110,121,0.2)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#efc1c8' }}>Social Connections</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', opacity: 0.6 }}>Instagram URL</label>
              <input type="text" name="socials.instagram" value={formData.socials.instagram} onChange={handleInputChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', opacity: 0.6 }}>Facebook URL</label>
              <input type="text" name="socials.facebook" value={formData.socials.facebook} onChange={handleInputChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', opacity: 0.6 }}>Twitter/X URL</label>
              <input type="text" name="socials.twitter" value={formData.socials.twitter} onChange={handleInputChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', opacity: 0.6 }}>LinkedIn URL</label>
              <input type="text" name="socials.linkedin" value={formData.socials.linkedin} onChange={handleInputChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.3rem', opacity: 0.6 }}>WhatsApp Number</label>
              <input type="text" name="socials.whatsapp" value={formData.socials.whatsapp} onChange={handleInputChange} style={inputStyle} placeholder="+91..." />
            </div>
          </div>
        </section>

        {error && <p style={{ color: '#e0115f', fontWeight: '500' }}>{error}</p>}
        {success && <p style={{ color: '#efc1c8', fontWeight: '500' }}>{success}</p>}

        <button type="submit" className="btn-primary" disabled={saving || uploading} style={{ padding: '14px 40px', width: 'max-content' }}>
          {saving ? 'Saving...' : '✨ Update Photographer Profile'}
        </button>
      </form>
    </div>
  );
};

export default AdminAbout;
