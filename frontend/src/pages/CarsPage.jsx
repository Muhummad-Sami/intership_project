import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import CarCard from '../components/CarCard';

// Static categories – you can also derive from API if you want
const categories = ['All', 'Luxury', 'SUV', 'Sports', 'Electric'];

export default function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch cars from API
  useEffect(() => {
    api.get("/cars")
      .then(res => setCars(res.data))
      .catch(err => console.error("Failed to load cars", err))
      .finally(() => setLoading(false));
  }, []);

  // Sync category with URL param
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  // Filter and sort
  const filtered = cars
    .filter(car => {
      const matchCat = activeCategory === 'All' || car.category === activeCategory;
      const matchSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'power') {
        const powerA = parseInt(a.power) || 0;
        const powerB = parseInt(b.power) || 0;
        return powerB - powerA;
      }
      return 0;
    });

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  if (loading) return <div style={{ paddingTop: 73, textAlign: "center" }}>Loading fleet...</div>;

  return (
    <div style={{ paddingTop: 73, minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--surface-container-lowest)', padding: '64px 80px 48px', position: 'relative', overflow: 'hidden' }}>
        <div className="glow-bg" style={{ width: 500, height: 300, top: '-100px', right: '-50px', zIndex: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: 0 }}>
          <div className="label-caps" style={{ color: 'var(--gold)', marginBottom: 12 }}>Our Fleet</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, color: 'var(--on-surface)', marginBottom: 12, letterSpacing: '-0.02em' }}>
            Explore Our Collection
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 16, maxWidth: 480 }}>
            {cars.length} exceptional vehicles available. Reserve yours today.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ background: 'var(--surface-container)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 80px', position: 'sticky', top: 73, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', maxWidth: 1440, margin: '0 auto' }}>
          {/* Search */}
          <div className="search-box">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--outline)' }}>search</span>
            <input
              placeholder="Search by name or brand..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ marginLeft: 'auto' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                background: 'var(--surface-container-high)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--on-surface)', borderRadius: 4, padding: '8px 14px',
                fontSize: 12, letterSpacing: '0.05em', fontWeight: 600, cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="power">Most Powerful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="section" style={{ paddingTop: 48 }}>
        {filtered.length > 0 ? (
          <>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 13, marginBottom: 32 }}>
              {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 28 }}>
              {filtered.map(car => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, color: 'var(--outline)', display: 'block', marginBottom: 16 }}>directions_car</span>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: 'var(--on-surface)', marginBottom: 8 }}>No vehicles found</h3>
            <p style={{ color: 'var(--on-surface-variant)' }}>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="padding: '64px 80px"] { padding: 40px 20px !important; }
          div[style*="padding: '20px 80px"] { padding: 16px 20px !important; }
          .search-box input { width: 140px !important; }
        }
      `}</style>
    </div>
  );
}