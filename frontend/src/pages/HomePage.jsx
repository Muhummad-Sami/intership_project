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

  const fetchCars = () => {
    api.get("/cars")
      .then(res => {
        // ✅ Ensure response data is always an array
        setCars(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Failed to load cars", err);
        setCars([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCars();
    const interval = setInterval(fetchCars, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Safe slice – ensures featured is always an array
  const featured = Array.isArray(cars) ? cars.slice(0, 5) : [];

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => {
        const next = (prev + 1) % featured.length;
        const el = carouselRef.current;
        if (el) {
          const cardWidth = el.offsetWidth * 0.75 + 32;
          el.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const scrollCarousel = (dir) => {
    if (featured.length === 0) return;
    const newSlide = Math.max(0, Math.min(featured.length - 1, activeSlide + dir));
    setActiveSlide(newSlide);
    const el = carouselRef.current;
    if (el) {
      const cardWidth = el.offsetWidth * 0.75 + 32;
      el.scrollTo({ left: newSlide * cardWidth, behavior: 'smooth' });
    }
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
      <section style={{
        position: 'relative',
        minHeight: 'clamp(80vh, 100vh, 100vh)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '20px'
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div className="hero-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVGrFqWR4pRKLccOt3cR70gZ-n1Np5pXfNkW6CjoocJkynXZoWXZ3_WXmdoXPfN16pTFb3PfF9TrFaCEW5yigEzw1fo8n9EdEkRoNYSSHptUEttgdcbO2hE-hCGyWymhkwUxihjUzsQfNFVsBZA-yo3Ospkc_JFHAX5S3aM8eFtRPATxnndvxWkSyTqxD8XK9V5Vs3vS097WoMZC0IglKl_FP_mTDNeE_aokzf0LDmSG3ml7RRgpZ6r1_loETc515eUF2fRR_2DKs"
            alt="Hero Luxury Car"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.75 }}
          />
        </div>
        <div className="fade-in" style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: 900,
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(16px, 3vw, 24px)'
        }}>
          <div className="label-caps" style={{ color: 'var(--gold)', letterSpacing: '0.3em', fontSize: 'clamp(10px, 1vw, 14px)' }}>
            The Pinnacle of Automotive Excellence
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(32px, 8vw, 80px)',
            fontWeight: 700,
            color: 'var(--on-surface)',
            lineHeight: 1.08,
            letterSpacing: '-0.02em'
          }}>
            Drive Your<br/>Dream Car
          </h1>
          <p style={{
            color: 'var(--on-surface-variant)',
            fontSize: 'clamp(14px, 1.8vw, 18px)',
            lineHeight: 1.7,
            maxWidth: 560,
            padding: '0 10px'
          }}>
            Luxury. Comfort. Performance. Experience the pinnacle of automotive engineering designed for the uncompromising few.
          </p>
          <div style={{ display: 'flex', gap: 'clamp(12px, 2vw, 16px)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            <button className="btn-primary" style={{ padding: 'clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 32px)', fontSize: 'clamp(10px, 1vw, 12px)' }} onClick={() => navigate('/cars')}>
              Explore Fleet
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            </button>
            <button className="btn-ghost" style={{ padding: 'clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 32px)', fontSize: 'clamp(10px, 1vw, 12px)' }} onClick={() => navigate('/booking')}>
              View Reservations
            </button>
          </div>
        </div>
      </section>

      {/* ─── FEATURED CAROUSEL ─── */}
      <section className="section" style={{ padding: 'clamp(40px, 6vw, 96px) clamp(16px, 5vw, 80px)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 'clamp(24px, 3vw, 40px)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(24px, 4vw, 48px)',
            fontWeight: 600,
            color: 'var(--on-surface)'
          }}>
            Featured Fleet
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="carousel-btn" onClick={() => scrollCarousel(-1)}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
            </button>
            <button className="carousel-btn" onClick={() => scrollCarousel(1)}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="hide-scrollbar"
          style={{
            display: 'flex',
            gap: 'clamp(16px, 2.5vw, 32px)',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: 16,
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {featured.map((car) => (
            <div
              key={car._id}
              style={{
                minWidth: 'clamp(260px, 75vw, 600px)',
                scrollSnapAlign: 'center',
                flexShrink: 0
              }}
            >
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      {/* ─── CATEGORIES ─── */}
<section style={{ background: 'var(--surface-container-lowest)', padding: 'clamp(40px, 8vw, 96px) 0' }}>
  <div className="container" style={{ padding: '0 clamp(16px, 4vw, 80px)' }}>
    <h2 style={{
      fontFamily: "'Playfair Display',serif",
      fontSize: 'clamp(24px, 4vw, 48px)',
      fontWeight: 600,
      color: 'var(--on-surface)',
      textAlign: 'center',
      marginBottom: 'clamp(24px, 4vw, 48px)'
    }}>
      Curated Collections
    </h2>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',  // ✅ Original style
      gap: 'clamp(12px, 1.5vw, 16px)'
    }}>
      {categories.map(cat => (
        <div
          key={cat.key}
          className="category-card"
          style={{ height: 'clamp(200px, 30vh, 320px)' }}
          onClick={() => navigate(`/cars?category=${cat.key}`)}
        >
          <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="overlay" />
          <div className="label" style={{ padding: 'clamp(16px, 2vw, 24px)' }}>
            <h3 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(18px, 2.5vw, 26px)',
              fontWeight: 500,
              color: 'var(--on-surface)'
            }}>
              {cat.name}
            </h3>
            <div className="explore-text" style={{ fontSize: 'clamp(10px, 1vw, 11px)' }}>Explore Collection →</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ─── WHY DRIVELUX ─── */}
      <section className="section" style={{ padding: 'clamp(40px, 8vw, 96px) clamp(16px, 5vw, 80px)', position: 'relative' }}>
        <div className="glow-bg" style={{ width: 'clamp(200px, 40vw, 400px)', height: 'clamp(200px, 40vw, 400px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }} />
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(24px, 4vw, 48px)',
            fontWeight: 600,
            color: 'var(--on-surface)',
            marginBottom: 'clamp(12px, 1.5vw, 16px)'
          }}>
            Why DriveLux
          </h2>
          <p style={{
            color: 'var(--on-surface-variant)',
            fontSize: 'clamp(14px, 1.5vw, 18px)',
            maxWidth: 560,
            margin: '0 auto',
            padding: '0 10px'
          }}>
            Experience unparalleled excellence tailored for the world's most discerning drivers.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(220px, 28vw, 280px), 1fr))',
          gap: 'clamp(16px, 2vw, 24px)',
          position: 'relative',
          zIndex: 1
        }}>
          {[
            { icon: 'room_service', title: 'White-Glove Service', desc: 'From personalized delivery to 24/7 concierge support, we anticipate your every need.' },
            { icon: 'public', title: 'Global Access', desc: 'Seamlessly transition between top-tier vehicles in major cities across the globe.' },
            { icon: 'verified', title: 'Pristine Fleet', desc: 'Meticulously maintained and detailed, every car arrives in flawless showroom condition.' },
          ].map(f => (
            <div
              key={f.title}
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                padding: 'clamp(20px, 2.5vw, 32px)',
                transition: 'border-color 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <span className="material-symbols-outlined" style={{
                fontSize: 'clamp(32px, 4vw, 40px)',
                color: 'var(--gold)',
                marginBottom: 'clamp(12px, 1.5vw, 20px)',
                display: 'block'
              }}>
                {f.icon}
              </span>
              <h3 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 'clamp(18px, 2vw, 24px)',
                fontWeight: 500,
                color: 'var(--on-surface)',
                marginBottom: 'clamp(8px, 1vw, 12px)'
              }}>
                {f.title}
              </h3>
              <p style={{
                color: 'var(--on-surface-variant)',
                fontSize: 'clamp(13px, 1.2vw, 15px)',
                lineHeight: 1.7
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ background: 'var(--surface-container-lowest)', padding: 'clamp(40px, 8vw, 96px) clamp(16px, 5vw, 80px)' }}>
        <div className="container" style={{ maxWidth: 1400, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(24px, 4vw, 48px)',
            fontWeight: 600,
            color: 'var(--on-surface)',
            textAlign: 'center',
            marginBottom: 'clamp(24px, 4vw, 48px)'
          }}>
            Client Testimonials
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px, 30vw, 320px), 1fr))',
            gap: 'clamp(16px, 2vw, 24px)'
          }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(30,32,32,0.5)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 8,
                  padding: 'clamp(20px, 2.5vw, 32px)',
                  position: 'relative'
                }}
              >
                <div className="testimonial-quote" style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '-16px',
                  color: 'var(--gold)',
                  opacity: 0.18,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(60px, 8vw, 100px)',
                  lineHeight: 1
                }}>
                  "
                </div>
                <p style={{
                  color: 'var(--on-surface-variant)',
                  fontSize: 'clamp(14px, 1.2vw, 16px)',
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                  marginBottom: 'clamp(16px, 2vw, 28px)',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {t.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'var(--surface)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 20,
                    color: 'var(--gold)'
                  }}>
                    {t.initial}
                  </div>
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
      <section className="section" style={{ padding: 'clamp(40px, 6vw, 96px) clamp(16px, 5vw, 80px)', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(30,32,32,0.4) 100%)',
          border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: 12,
          padding: 'clamp(32px, 6vw, 80px) clamp(20px, 5vw, 40px)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(24px, 4vw, 48px)',
            fontWeight: 600,
            color: 'var(--on-surface)',
            marginBottom: 'clamp(12px, 1.5vw, 16px)'
          }}>
            Ready to Elevate Your Drive?
          </h2>
          <p style={{
            color: 'var(--on-surface-variant)',
            fontSize: 'clamp(14px, 1.5vw, 18px)',
            marginBottom: 'clamp(24px, 3vw, 36px)',
            maxWidth: 480,
            margin: '0 auto clamp(24px, 3vw, 36px)'
          }}>
            Browse our curated fleet and reserve your dream car today.
          </p>
          <button
            className="btn-primary"
            style={{
              fontSize: 'clamp(10px, 1vw, 13px)',
              padding: 'clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 48px)'
            }}
            onClick={() => navigate('/cars')}
          >
            Browse All Cars
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
}