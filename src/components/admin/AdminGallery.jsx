import React, { useState, useEffect, useRef } from 'react';
import {
  getAlbums, createAlbum, deleteAlbum,
  getPhotos, addPhoto, deletePhoto,
  uploadImage
} from '../../services/api';

// ── Constants ─────────────────────────────────────────────────────────────────
const EVENT_TAGS = [
  { id: 'haldi',       label: '🌼 Haldi' },
  { id: 'mehndi',      label: '🌿 Mehndi' },
  { id: 'baraat',      label: '🐎 Baraat' },
  { id: 'reception',   label: '💍 Reception' },
  { id: 'engagement',  label: '💑 Engagement' },
  { id: 'pre-wedding', label: '📸 Pre-Wedding' },
  { id: 'wedding',     label: '👰 Wedding' },
  { id: 'other',       label: '✨ Other' },
];

// ── Upload zone helper ─────────────────────────────────────────────────────────
function DropZone({ onFile, preview, compact = false }) {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) onFile(file);
  };

  return (
    <div
      onClick={() => fileRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      style={{
        border: `2px dashed ${dragOver ? 'var(--brown)' : 'var(--brown3)'}`,
        borderRadius: '10px',
        padding: compact ? '1rem' : '1.5rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragOver ? 'rgba(0,0,0,0.03)' : 'transparent',
        minHeight: compact ? 'auto' : '120px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
        transition: 'all 0.2s',
      }}>
      {preview ? (
        <>
          <img src={preview} alt="preview" style={{ maxHeight: compact ? '100px' : '160px', maxWidth: '100%', borderRadius: '6px', objectFit: 'cover' }} />
          <p style={{ fontSize: '0.75rem', opacity: 0.5, margin: 0 }}>Click to change</p>
        </>
      ) : (
        <>
          <span style={{ fontSize: compact ? '1.5rem' : '2rem' }}>📁</span>
          <p style={{ margin: 0, fontSize: compact ? '0.8rem' : '0.9rem', fontWeight: '500' }}>
            {compact ? 'Click or drag image' : 'Drag & drop or click to select image'}
          </p>
          {!compact && <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.5 }}>JPG, PNG, WEBP — max 20MB</p>}
        </>
      )}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
    </div>
  );
}

// ── Multi-file drop zone ───────────────────────────────────────────────────────
function MultiDropZone({ onFiles }) {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) onFiles(files);
  };

  return (
    <div
      onClick={() => fileRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      style={{
        border: `2px dashed ${dragOver ? 'var(--brown)' : 'var(--brown3)'}`,
        borderRadius: '10px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
        background: dragOver ? 'rgba(0,0,0,0.03)' : 'transparent', transition: 'all 0.2s',
        minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
      }}>
      <span style={{ fontSize: '1.8rem' }}>🖼️</span>
      <p style={{ margin: 0, fontWeight: '500', fontSize: '0.9rem' }}>Drag & drop multiple photos here</p>
      <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.5 }}>or click to select (multiple allowed)</p>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => {
        const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
        if (files.length) onFiles(files);
      }} />
    </div>
  );
}

// ── Tag chip ──────────────────────────────────────────────────────────────────
function TagChip({ tag, selected, onToggle }) {
  return (
    <button onClick={() => onToggle(tag.id)}
      style={{
        padding: '5px 14px', borderRadius: '20px',
        border: `1.5px solid ${selected ? 'var(--brown)' : 'var(--brown3)'}`,
        background: selected ? 'var(--brown)' : 'transparent',
        color: selected ? 'white' : 'var(--brown)',
        cursor: 'pointer', fontSize: '0.82rem', fontWeight: '500',
        transition: 'all 0.18s', whiteSpace: 'nowrap',
      }}>
      {tag.label}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const AdminGallery = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // null = list view
  const [photos, setPhotos] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);
  const [showAddPhotos, setShowAddPhotos] = useState(false);
  const [error, setError] = useState('');
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // status message

  // New album form
  const [newAlbum, setNewAlbum] = useState({ title: '', availableEvents: [] });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [creatingAlbum, setCreatingAlbum] = useState(false);

  // Add photos form
  const [pendingPhotos, setPendingPhotos] = useState([]); // [{ file, preview, tag }]
  const [globalTag, setGlobalTag] = useState('wedding');

  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    try {
      const res = await getAlbums();
      if (res.success) setAlbums(res.data);
    } catch { setError('Failed to load albums'); }
    finally { setLoadingAlbums(false); }
  };

  const openAlbum = async (album) => {
    setSelectedAlbum(album);
    setLoadingPhotos(true);
    try {
      const res = await getPhotos(album.id);
      if (res.success) setPhotos(res.data);
    } catch { setError('Failed to load photos'); }
    finally { setLoadingPhotos(false); }
  };

  // ── Create Album ────────────────────────────────────────────────────────────
  const handleCreateAlbum = async () => {
    if (!newAlbum.title.trim()) { setError('Album title is required'); return; }
    if (!coverFile) { setError('Please select a cover image'); return; }
    setError('');
    setCreatingAlbum(true);
    try {
      const uploadRes = await uploadImage(coverFile, 'abhay-photography/covers');
      if (!uploadRes.success) throw new Error('Cover upload failed');

      const slug = newAlbum.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        id: slug,
        title: newAlbum.title.trim(),
        coverImage: uploadRes.url,
        coverPublicId: uploadRes.publicId,
        availableEvents: newAlbum.availableEvents,
      };
      const res = await createAlbum(payload);
      if (res.success) {
        setAlbums([...albums, res.data]);
        setNewAlbum({ title: '', availableEvents: [] });
        setCoverFile(null);
        setCoverPreview(null);
        setShowNewAlbumModal(false);
      }
    } catch (e) {
      setError(e.message || 'Failed to create album');
    } finally {
      setCreatingAlbum(false);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm('Delete this entire album? All photos will be removed from Cloudinary too.')) return;
    try {
      const res = await deleteAlbum(albumId);
      if (res.success) setAlbums(albums.filter(a => a._id !== albumId));
    } catch { setError('Delete failed'); }
  };

  // ── Add Photos ──────────────────────────────────────────────────────────────
  const handleMultiFiles = (files) => {
    const items = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      tag: globalTag,
    }));
    setPendingPhotos(prev => [...prev, ...items]);
  };

  const updatePhotoTag = (index, tag) => {
    setPendingPhotos(prev => prev.map((p, i) => i === index ? { ...p, tag } : p));
  };

  const removePending = (index) => {
    setPendingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadPhotos = async () => {
    if (pendingPhotos.length === 0) { setError('Add at least one photo'); return; }
    setUploadingPhotos(true);
    setError('');
    const total = pendingPhotos.length;
    let done = 0;

    const uploaded = [];
    for (const item of pendingPhotos) {
      try {
        setUploadStatus(`Uploading ${done + 1} of ${total}...`);
        const upRes = await uploadImage(item.file, `abhay-photography/albums/${selectedAlbum.id}`);
        if (upRes.success) {
          const saveRes = await addPhoto({
            albumId: selectedAlbum.id,
            event: item.tag,
            src: upRes.url,
            publicId: upRes.publicId,
            alt: selectedAlbum.title,
          });
          if (saveRes.success) uploaded.push(saveRes.data);
        }
      } catch (e) {
        console.error('Photo upload failed:', e);
      }
      done++;
    }

    setPhotos(prev => [...prev, ...uploaded]);
    setPendingPhotos([]);
    setUploadingPhotos(false);
    setUploadStatus('');
    setShowAddPhotos(false);
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Delete this photo from Cloudinary?')) return;
    try {
      const res = await deletePhoto(photoId);
      if (res.success) setPhotos(photos.filter(p => p._id !== photoId));
    } catch { setError('Delete failed'); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid var(--brown2)', borderRadius: '8px',
    background: 'rgba(255,255,255,0.6)', color: 'var(--brown)',
    fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  };

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '1rem',
  };

  const modalStyle = {
    background: 'var(--cream)', borderRadius: '16px', padding: '2rem',
    width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '1px solid var(--brown3)',
  };

  // ── LEVEL 2: Album Detail View ──────────────────────────────────────────────
  if (selectedAlbum) {
    const grouped = EVENT_TAGS.reduce((acc, tag) => {
      const tagPhotos = photos.filter(p => p.event === tag.id);
      if (tagPhotos.length > 0) acc[tag.id] = { label: tag.label, photos: tagPhotos };
      return acc;
    }, {});
    const ungrouped = photos.filter(p => !EVENT_TAGS.find(t => t.id === p.event));

    return (
      <div style={{ color: 'var(--brown)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => { setSelectedAlbum(null); setPhotos([]); }} className="btn-ghost">
            ← Back
          </button>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', margin: 0 }}>{selectedAlbum.title}</h2>
            <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>{photos.length} photos · {selectedAlbum.availableEvents?.join(', ')}</p>
          </div>
          <button onClick={() => setShowAddPhotos(true)} className="btn-primary" style={{ marginLeft: 'auto', padding: '8px 20px' }}>
            + Add Photos
          </button>
        </div>

        {error && <p style={{ color: '#c0392b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

        {loadingPhotos ? (
          <p style={{ opacity: 0.6 }}>Loading photos...</p>
        ) : photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
            <p style={{ fontSize: '2rem' }}>📭</p>
            <p>No photos yet. Click "+ Add Photos" to upload.</p>
          </div>
        ) : (
          <>
            {Object.entries(grouped).map(([tagId, { label, photos: tagPhotos }]) => (
              <div key={tagId} style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', borderBottom: '1px solid var(--brown3)', paddingBottom: '0.4rem' }}>
                  {label} <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>({tagPhotos.length})</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {tagPhotos.map(photo => (
                    <div key={photo._id} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--brown3)', position: 'relative', background: 'rgba(255,255,255,0.4)' }}>
                      <img src={photo.src} alt={photo.alt || ''} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
                      <button onClick={() => handleDeletePhoto(photo._id)} className="btn-danger-metallic"
                        style={{ position: 'absolute', top: '6px', right: '6px', padding: '2px 8px' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {ungrouped.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>✨ Untagged</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {ungrouped.map(photo => (
                    <div key={photo._id} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--brown3)', position: 'relative' }}>
                      <img src={photo.src} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
                      <button onClick={() => handleDeletePhoto(photo._id)}
                        style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(192,57,43,0.9)', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Add Photos Modal */}
        {showAddPhotos && (
          <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) setShowAddPhotos(false); }}>
            <div style={{ ...modalStyle, maxWidth: '700px' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', marginBottom: '1rem' }}>
                Add Photos to "{selectedAlbum.title}"
              </h3>

              {/* Global tag */}
              <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.7 }}>Default tag (applies to all unless changed per-photo):</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {EVENT_TAGS.map(tag => (
                  <TagChip key={tag.id} tag={tag} selected={globalTag === tag.id}
                    onToggle={() => {
                      setGlobalTag(tag.id);
                      setPendingPhotos(prev => prev.map(p => ({ ...p, tag: tag.id })));
                    }} />
                ))}
              </div>

              <MultiDropZone onFiles={handleMultiFiles} />

              {/* Pending preview */}
              {pendingPhotos.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem' }}>{pendingPhotos.length} photo(s) selected — assign tag per photo if needed:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {pendingPhotos.map((item, i) => (
                      <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--brown3)', background: 'rgba(255,255,255,0.5)' }}>
                        <div style={{ position: 'relative' }}>
                          <img src={item.preview} alt="" style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }} />
                          <button onClick={() => removePending(i)}
                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(192,57,43,0.85)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 7px', cursor: 'pointer', fontSize: '0.7rem' }}>
                            ✕
                          </button>
                        </div>
                        <select value={item.tag} onChange={(e) => updatePhotoTag(i, e.target.value)}
                          style={{ width: '100%', padding: '5px 8px', border: 'none', borderTop: '1px solid var(--brown3)', background: 'rgba(255,255,255,0.8)', color: 'var(--brown)', fontSize: '0.78rem', cursor: 'pointer' }}>
                          {EVENT_TAGS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
              {uploadStatus && <p style={{ color: 'var(--brown)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>{uploadStatus}</p>}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button onClick={() => { setShowAddPhotos(false); setPendingPhotos([]); }} className="btn-ghost">
                  Cancel
                </button>
                <button onClick={handleUploadPhotos} disabled={uploadingPhotos || pendingPhotos.length === 0}
                  className="btn-primary" style={{ padding: '9px 24px', opacity: pendingPhotos.length > 0 ? 1 : 0.5 }}>
                  {uploadingPhotos ? uploadStatus || 'Uploading...' : `Upload ${pendingPhotos.length} Photo${pendingPhotos.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── LEVEL 1: Albums List View ───────────────────────────────────────────────
  return (
    <div style={{ color: 'var(--brown)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', margin: 0 }}>Albums</h2>
        <button onClick={() => setShowNewAlbumModal(true)} className="btn-primary">
          + New Album
        </button>
      </div>

      {error && <p style={{ color: '#c0392b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

      {loadingAlbums ? (
        <p style={{ opacity: 0.6 }}>Loading albums...</p>
      ) : albums.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
          <p style={{ fontSize: '2.5rem' }}>📂</p>
          <p>No albums yet. Click "+ New Album" to create one.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {albums.map(album => (
            <div key={album._id} style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--brown3)', background: 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
              onClick={() => openAlbum(album)}>
              <div style={{ position: 'relative' }}>
                <img src={album.coverImage} alt={album.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
                <h3 style={{ position: 'absolute', bottom: '10px', left: '12px', color: 'white', margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                  {album.title}
                </h3>
              </div>
              <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {(album.availableEvents || []).slice(0, 3).map(ev => (
                    <span key={ev} style={{ fontSize: '0.72rem', background: 'var(--brown3)', padding: '2px 8px', borderRadius: '10px', color: 'var(--brown)', fontWeight: '500' }}>
                      {EVENT_TAGS.find(t => t.id === ev)?.label || ev}
                    </span>
                  ))}
                  {album.availableEvents?.length > 3 && (
                    <span style={{ fontSize: '0.72rem', opacity: 0.6 }}>+{album.availableEvents.length - 3}</span>
                  )}
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album._id); }} className="btn-danger-metallic">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Album Modal */}
      {showNewAlbumModal && (
        <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) setShowNewAlbumModal(false); }}>
          <div style={modalStyle}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', marginBottom: '1.25rem' }}>Create New Album</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', opacity: 0.7 }}>Album Title *</label>
              <input type="text" placeholder="e.g. Rahul & Priya" value={newAlbum.title}
                onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                style={inputStyle} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', opacity: 0.7 }}>Cover Image *</label>
              <DropZone
                onFile={(file) => { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }}
                preview={coverPreview}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.7 }}>Event Tags (select all that apply)</label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {EVENT_TAGS.map(tag => (
                  <TagChip key={tag.id} tag={tag}
                    selected={newAlbum.availableEvents.includes(tag.id)}
                    onToggle={(id) => {
                      const current = newAlbum.availableEvents;
                      setNewAlbum({
                        ...newAlbum,
                        availableEvents: current.includes(id) ? current.filter(e => e !== id) : [...current, id]
                      });
                    }} />
                ))}
              </div>
            </div>

            {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowNewAlbumModal(false); setError(''); setCoverFile(null); setCoverPreview(null); setNewAlbum({ title: '', availableEvents: [] }); }}
                className="btn-ghost">
                Cancel
              </button>
              <button onClick={handleCreateAlbum} disabled={creatingAlbum}
                className="btn-primary" style={{ padding: '9px 24px', opacity: creatingAlbum ? 0.5 : 1 }}>
                {creatingAlbum ? 'Creating...' : 'Create Album'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
