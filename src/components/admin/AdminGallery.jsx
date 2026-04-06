import React, { useState, useEffect } from 'react';
import { getAlbums, createAlbum, deleteAlbum } from '../../services/api';

const AdminGallery = () => {
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState({ id: '', title: '', coverImage: '', availableEvents: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await getAlbums();
      if (res.success) setAlbums(res.data);
    } catch (error) {
      console.error('Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const events = newAlbum.availableEvents.split(',').map(e => e.trim()).filter(e => e !== '');
      const payload = { ...newAlbum, availableEvents: events };
      const res = await createAlbum(payload);
      if (res.success) {
        setAlbums([...albums, res.data]);
        setNewAlbum({ id: '', title: '', coverImage: '', availableEvents: '' });
      }
    } catch (error) {
      console.error('Failed to add album');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAlbum(id);
      if (res.success) {
        setAlbums(albums.filter(album => album._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete album');
    }
  };

  return (
    <div style={{ background: 'var(--cream2)', padding: '2rem', borderRadius: '12px', color: 'var(--brown)' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '1.5rem' }}>Manage Albums</h2>
      
      <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
        <input 
          type="text" 
          placeholder="Slug/ID (e.g. rahul-priya)" 
          value={newAlbum.id} 
          onChange={(e) => setNewAlbum({...newAlbum, id: e.target.value})} 
          required 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="text" 
          placeholder="Title (e.g. Rahul & Priya)" 
          value={newAlbum.title} 
          onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})} 
          required 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="text" 
          placeholder="Cover Image URL" 
          value={newAlbum.coverImage} 
          onChange={(e) => setNewAlbum({...newAlbum, coverImage: e.target.value})} 
          required 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="text" 
          placeholder="Events (comma separated, e.g. mehendi, haldi)" 
          value={newAlbum.availableEvents} 
          onChange={(e) => setNewAlbum({...newAlbum, availableEvents: e.target.value})} 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <button type="submit" className="btn-primary" style={{ width: 'max-content' }}>Add Album</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {albums.map(album => (
            <div key={album._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--brown3)', borderRadius: '8px', background: 'var(--cream)'}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={album.coverImage} alt={album.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{album.title}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>ID: {album.id} | Events: {album.availableEvents?.join(', ')}</div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(album._id)}
                className="btn-ghost"
                style={{ padding: '8px 16px' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
