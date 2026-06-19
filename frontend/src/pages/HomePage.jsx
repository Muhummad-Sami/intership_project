import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CarCard from '../components/CarCard';

export default function HomePage() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch cars function
  const fetchCars = () => {
    api.get("/cars")
      .then(res => setCars(res.data))
      .catch(err => console.error("Failed to load cars", err))
      .finally(() => setLoading(false));
  };

  // ✅ Fetch on mount + poll every 30 seconds
  useEffect(() => {
    fetchCars();
    const interval = setInterval(fetchCars, 5000); // refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  const featured = cars.slice(0, 5);

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => {
        const next = (prev + 1) % featured.length;
        carouselRef.current?.scrollTo({ left: next * (carouselRef.current.offsetWidth * 0.75 + 32), behavior: 'smooth' });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const scrollCarousel = (dir) => {
    if (featured.length === 0) return;
    const newSlide = Math.max(0, Math.min(featured.length - 1, activeSlide + dir));
    setActiveSlide(newSlide);
    carouselRef.current?.scrollTo({ left: newSlide * (carouselRef.current.offsetWidth * 0.75 + 32), behavior: 'smooth' });
  };

  const categories = [
    { name: 'Luxury Cars', key: 'Luxury', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUh1ncP6GpjeYeuThl2yCde65zenDGcm0qDVQeXuMr2Mi7pQnC-JFRRYntRKEHoMsw9B8ANu_QKcrG7wBMRcKtl3bNQIWJy8eZbj2DLwhpw6s6mDFX0vwoE0xc36SWonPCytp0uhR_3AVkQ2pL9PP3GEAJ72xdZxk1kXIEGqs6BiO26jfI1DNrCeLz-7hcrVJsl2gNP_pWimQcqTwpTlW7CdZwlG3Eh9eZx9xelH0rVha485qdzyTwlecv3QMVBnCu9E-OZNG-yfM' },
    { name: 'Premium SUVs', key: 'SUV', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0M0MzfL7B-XkbSNM445R5jhLKiS2USbIPq2FUJnbpKCGUxzD4YKP0_mvf9FBQytLvzlCJ9tlw82xYUxUxGhSDqmxoGs6BU1aOX4JfGGitCAbHpQcx4YgnZ_A9rwtAsT7UOxJP4gflLPIqL_kJ3kMyI7KaeDnKW1TxH-EWTh4DBkpM667LiDFAkrCetv_IeJt0p6pmqbkCBpoCGSavkCT47N58HR4ZFBpEiPwHiguFUsYR7eAjoiY3WqGfMDKJuFkKshHqvoqLGkQ' },
    { name: 'Exotic Sports', key: 'Sports', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmJrJ89Y07_Nvwhg8Tj_qJpJALvNutROB944QkA1V_n-6iocfANf5aiRCexpAqMsJs3JrGgFSr8dvCGODGZDdM8-aOsLa7MAbkxBXLHfBYnKHfKlVWTvMn5XAIP_RlIOCevmxEgtKbF7F-CxkACnXCsmixfaTfhqrgqVNO79nAK2cOzzQY9Me2_7f_iQKGrpfPU5ht7RNSz6hqipx1TxxsuG4sQmgXLDtVFhRF1nDbv6buegYMieHNfcHAqKwTSBtmv_1tM2E3dAc' },
    { name: 'Electric Luxury', key: 'Electric', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJhT63HYGKYNQez21z87NCEj8gWUsluAU7AGwU1qWEFJ7D953FJiIusTfT-PR-eDqPza-yWa-CYQti9MahkDcVih-R0-E2_Qzv4ryUJqwIccDUpdzW_aP67OeFKfUXFqE_bUy1TORAaP9I_11QiTNqOxmoTGk8eqFRmCXrvW9nm9Bhxk4Y2YwLCQOty9ZY4QJ5AoCft8cxSTLgHHbqIxkWlkl1omVYmlOX7YofQFWq_9qmCT4T2SZFjlRc0B9PSvtruO7zVJYMp1g' },
  ];

  const testimonials = [
    { quote: '"The level of service is simply unmatched. The GT3 RS was delivered perfectly on time, right to my hotel in Monaco."', name: 'Alexander W.', role: 'VIP Member', initial: 'A' },
    { quote: '"DriveLux made our anniversary weekend unforgettable. The Roma was pristine, and the concierge was incredibly helpful."', name: 'Elena S.', role: 'Exclusive Client', initial: 'E' },
    { quote: '"Access to such a phenomenal fleet anywhere in the world makes DriveLux an indispensable service for my travels."', name: 'James T.', role: 'Corporate Member', initial: 'J' },
  ];

  if (loading) {
    return <div style={{ paddingTop: 73, textAlign: 'center' }}>Loading cars...</div>;
  }

  return (
    <div style={{ paddingTop: 73 }}>
      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div className="hero-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVGrFqWR4pRKLccOt3cR70gZ-n1Np5pXfNkW6CjoocJkynXZoWXZ3_WXmdoXPfN16pTFb3PfF9TrFaCEW5yigEzw1fo8n9EdEkRoNYSSHptUEttgdcbO2hE-hCGyWymhkwUxihjUzsQfNFVsBZA-yo3Ospkc_JFHAX5S3aM8eFtRPATxnndvxWkSyTqxD8XK9V5Vs3vS097WoMZC0IglKl_FP_mTDNeE_aokzf0LDmSG3ml7RRgpZ6r1_loETc515eUF2fRR_2DKs"
            alt="Hero Luxury Car"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.75 }}
          />
        </div>
        <div className="fade-in" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 900, padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div className="label-caps" style={{ color: 'var(--gold)', letterSpacing: '0.3em' }}>The Pinnacle of Automotive Excellence</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(40px,7vw,80px)', fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.08, letterSpacing: '-0.02em' }}>
            Drive Your<br/>Dream Car
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 18, lineHeight: 1.7, maxWidth: 560 }}>
            Luxury. Comfort. Performance. Experience the pinnacle of automotive engineering designed for the uncompromising few.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            <button className="btn-primary" onClick={() => navigate('/cars')}>
              Explore Fleet
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            </button>
            <button className="btn-ghost" onClick={() => navigate('/booking')}>
              View Reservations
            </button>
          </div>
        </div>
      </section>

      {/* ─── FEATURED CAROUSEL ─── */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 600, color: 'var(--on-surface)' }}>Featured Fleet</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="carousel-btn" onClick={() => scrollCarousel(-1)}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
            </button>
            <button className="carousel-btn" onClick={() => scrollCarousel(1)}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
            </button>
          </div>
        </div>

        <div ref={carouselRef} className="hide-scrollbar" style={{ display: 'flex', gap: 32, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 16 }}>
          {featured.map((car) => (
            <div key={car._id} style={{ minWidth: 'min(85vw,600px)', scrollSnapAlign: 'center' }}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section style={{ background: 'var(--surface-container-lowest)', padding: '96px 0' }}>
        <div className="container">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 600, color: 'var(--on-surface)', textAlign: 'center', marginBottom: 48 }}>
            Curated Collections
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
            {categories.map(cat => (
              <div key={cat.key} className="category-card" onClick={() => navigate(`/cars?category=${cat.key}`)}>
                <img src={cat.img} alt={cat.name} />
                <div className="overlay" />
                <div className="label">
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 500, color: 'var(--on-surface)' }}>{cat.name}</h3>
                  <div className="explore-text">Explore Collection →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY DRIVELUX ─── */}
      <section className="section" style={{ position: 'relative' }}>
        <div className="glow-bg" style={{ width: 400, height: 400, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }} />
        <div style={{ textAlign: 'center', marginBottom: 64, position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 600, color: 'var(--on-surface)', marginBottom: 16 }}>Why DriveLux</h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 18, maxWidth: 560, margin: '0 auto' }}>
            Experience unparalleled excellence tailored for the world's most discerning drivers.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24, position: 'relative', zIndex: 1 }}>
          {[
            { icon: 'room_service', title: 'White-Glove Service', desc: 'From personalized delivery to 24/7 concierge support, we anticipate your every need.' },
            { icon: 'public', title: 'Global Access', desc: 'Seamlessly transition between top-tier vehicles in major cities across the globe.' },
            { icon: 'verified', title: 'Pristine Fleet', desc: 'Meticulously maintained and detailed, every car arrives in flawless showroom condition.' },
          ].map(f => (
            <div key={f.title}
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 32, transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--gold)', marginBottom: 20, display: 'block' }}>{f.icon}</span>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 500, color: 'var(--on-surface)', marginBottom: 12 }}>{f.title}</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: 15, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ background: 'var(--surface-container-lowest)', padding: '96px 0' }}>
        <div className="container">
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 600, color: 'var(--on-surface)', textAlign: 'center', marginBottom: 48 }}>
            Client Testimonials
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'rgba(30,32,32,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: 32, position: 'relative' }}>
                <div className="testimonial-quote">"</div>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: 16, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 28, position: 'relative', zIndex: 1 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: 20, color: 'var(--gold)' }}>{t.initial}</div>
                  <div>
                    <div className="label-caps" style={{ color: 'var(--on-surface)', marginBottom: 4 }}>{t.name}</div>
                    <div style={{ color: 'var(--on-surface-variant)', fontSize: 13 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(30,32,32,0.4) 100%)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '80px 40px', backdropFilter: 'blur(10px)' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 600, color: 'var(--on-surface)', marginBottom: 16 }}>
            Ready to Elevate Your Drive?
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 18, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Browse our curated fleet and reserve your dream car today.
          </p>
          <button className="btn-primary" style={{ fontSize: 13, padding: '16px 48px' }} onClick={() => navigate('/cars')}>
            Browse All Cars
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
}