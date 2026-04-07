import React, { useState, useEffect } from 'react';
import { getVideos, addVideo, deleteVideo } from '../../services/api';

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ title: '', embedUrl: '', order: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await getVideos();
      if (res.success) setVideos(res.data);
    } catch (error) {
      console.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await addVideo(newVideo);
      if (res.success) {
        setVideos([...videos, res.data]);
        setNewVideo({ title: '', embedUrl: '', order: 0 });
      }
    } catch (error) {
      console.error('Failed to add video');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteVideo(id);
      if (res.success) {
        setVideos(videos.filter(v => v._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete video');
    }
  };

  return (
    <div style={{ background: 'var(--cream2)', padding: '2rem', borderRadius: '12px', color: 'var(--brown)' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '1.5rem' }}>Manage Videos</h2>
      
      <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
        <input 
          type="text" 
          placeholder="Video Title" 
          value={newVideo.title} 
          onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} 
          required 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="text" 
          placeholder="Embed URL (e.g. Youtube embed src)" 
          value={newVideo.embedUrl} 
          onChange={(e) => setNewVideo({...newVideo, embedUrl: e.target.value})} 
          required 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="number" 
          placeholder="Order (optional)" 
          value={newVideo.order} 
          onChange={(e) => setNewVideo({...newVideo, order: parseInt(e.target.value) || 0})} 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <button type="submit" className="btn-primary" style={{ width: 'max-content', padding: '12px 24px' }}>Add Video</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {videos.map(video => (
            <div key={video._id} style={{ border: '1px solid var(--brown3)', borderRadius: '8px', overflow: 'hidden', background: 'var(--cream)' }}>
              <div style={{ width: '100%', aspectRatio: '16/9' }}>
                <iframe src={video.embedUrl} style={{ width: '100%', height: '100%', border: 'none' }} title={video.title} allowFullScreen />
              </div>
              <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{video.title}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Order: {video.order}</div>
                </div>
                <button onClick={() => handleDelete(video._id)} className="btn-danger-metallic">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVideos;
