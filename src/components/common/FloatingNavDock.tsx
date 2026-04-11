import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, ArrowUp } from 'lucide-react';

const FloatingNavDock = () => {
  const [showTop, setShowTop] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate('/'));

  const btnBase =
    'flex items-center justify-center w-11 h-11 rounded-full text-white transition-all duration-300 hover:bg-[hsl(var(--brand-pink))] hover:text-white';

  // Homepage: solo scroll-to-top circle
  if (isHome) {
    return (
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-[60] w-11 h-11 rounded-full bg-[hsl(var(--navy))]/90 border-2 border-[hsl(var(--navy))] text-white shadow-lg flex items-center justify-center backdrop-blur-xl transition-all duration-300 hover:bg-[hsl(var(--brand-pink))] hover:scale-110 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    );
  }

  // All other pages: unified dock
  return (
    <div
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-0 rounded-full border-2 border-[hsl(var(--navy))] bg-[hsl(var(--navy))]/90 shadow-lg overflow-hidden"
      style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <Link to="/" className={btnBase} aria-label="Home">
        <Home className="h-5 w-5" />
      </Link>

      <div className="w-px h-6 bg-white/20" />

      <button onClick={goBack} className={btnBase} aria-label="Go back">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div
        className={`flex items-center transition-all duration-300 ${
          showTop ? 'w-[calc(1px+2.75rem)] opacity-100' : 'w-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="w-px h-6 bg-white/20 shrink-0" />
        <button onClick={scrollToTop} className={`${btnBase} shrink-0`} aria-label="Back to top">
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FloatingNavDock;
