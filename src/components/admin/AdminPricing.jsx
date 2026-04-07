import React, { useState, useEffect } from 'react';
import { getPricing, addPricing, deletePricing } from '../../services/api';

const AdminPricing = () => {
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ tag: '', name: '', price: '', per: '', features: '', buttonText: 'Book Now', featured: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await getPricing();
      if (res.success) setPackages(res.data);
    } catch (error) {
      console.error('Failed to fetch pricing');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const featureList = newPackage.features.split('\n').filter(f => f.trim() !== '');
      const payload = { ...newPackage, features: featureList };
      const res = await addPricing(payload);
      if (res.success) {
        setPackages([...packages, res.data]);
        setNewPackage({ tag: '', name: '', price: '', per: '', features: '', buttonText: 'Book Now', featured: false });
      }
    } catch (error) {
      console.error('Failed to add pricing');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deletePricing(id);
      if (res.success) {
        setPackages(packages.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete pricing');
    }
  };

  return (
    <div style={{ background: 'var(--cream2)', padding: '2rem', borderRadius: '12px', color: 'var(--brown)' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '1.5rem' }}>Manage Pricing</h2>
      
      <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
        <input 
          type="text" 
          placeholder="Tag (e.g. Most Popular)" 
          value={newPackage.tag} 
          onChange={(e) => setNewPackage({...newPackage, tag: e.target.value})} 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="text" 
          placeholder="Package Name (e.g. Silver)" 
          value={newPackage.name} 
          onChange={(e) => setNewPackage({...newPackage, name: e.target.value})} 
          required 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="text" 
          placeholder="Price (e.g. ₹45,000)" 
          value={newPackage.price} 
          onChange={(e) => setNewPackage({...newPackage, price: e.target.value})} 
          required 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="text" 
          placeholder="Per (e.g. per occasion)" 
          value={newPackage.per} 
          onChange={(e) => setNewPackage({...newPackage, per: e.target.value})} 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <input 
          type="text" 
          placeholder="Button Text" 
          value={newPackage.buttonText} 
          onChange={(e) => setNewPackage({...newPackage, buttonText: e.target.value})} 
          style={{ width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brown)' }}>
          <input 
            type="checkbox" 
            checked={newPackage.featured} 
            onChange={(e) => setNewPackage({...newPackage, featured: e.target.checked})} 
          />
          Is Featured Package?
        </label>
        <textarea 
          placeholder="Features (one per line)" 
          value={newPackage.features} 
          onChange={(e) => setNewPackage({...newPackage, features: e.target.value})} 
          rows={4}
          required 
          style={{ gridColumn: 'span 2', width: '100%', padding: '12px', border: '1px solid var(--brown2)', background: 'var(--cream)', color: 'var(--brown)', borderRadius: '4px' }}
        />
        <button type="submit" className="btn-primary" style={{ width: 'max-content', gridColumn: 'span 2' }}>Add Package</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {packages.map(pkg => (
            <div key={pkg._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--brown3)', borderRadius: '8px', background: 'var(--cream)' }}>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', margin: 0 }}>{pkg.tag && <span style={{fontSize: '0.8rem', opacity: 0.6}}>[{pkg.tag}] </span>}{pkg.name} {pkg.featured && '⭐'}</h3>
                <div style={{ fontSize: '1.2rem', margin: '4px 0 12px 0', color: 'var(--red)' }}>{pkg.price} {pkg.per && <small style={{fontSize: '0.8rem', opacity: 0.7}}>({pkg.per})</small>}</div>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                  {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              <button onClick={() => handleDelete(pkg._id)} className="btn-ghost">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPricing;
