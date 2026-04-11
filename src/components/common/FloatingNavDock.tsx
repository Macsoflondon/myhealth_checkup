import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, ArrowUp } from 'lucide-react';

const FloatingNavDock = () => {
  const [showTop, setShowTop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Slide-in on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate('/'));

  const btnBase =
    'group/btn relative flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-300 hover:bg-[hsl(var(--brand-pink))] hover:text-white';

  const labelBase =
    'absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-heading font-semibold uppercase tracking-wider bg-[hsl(var(--navy))] text-white whitespace-nowrap opacity-0 scale-90 group-hover/btn:opacity-100 group-hover/btn:scale-100 transition-all duration-200 pointer-events-none shadow-md';

  // Homepage: solo scroll-to-top circle
  if (isHome) {
    return (
      <button
        onClick={scrollToTop}
        className={`group/btn fixed bottom-6 right-6 z-[60] w-12 h-12 rounded-full bg-[hsl(var(--navy))]/90 border-2 border-[hsl(var(--navy))] text-white shadow-lg flex items-center justify-center backdrop-blur-xl transition-all duration-500 hover:bg-[hsl(var(--brand-pink))] hover:scale-110 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <span className={labelBase}>Top</span>
        <ArrowUp className="h-5 w-5" />
      </button>
    );
  }

  // All other pages: unified dock with slide-in
  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-0 rounded-full border-2 border-[hsl(var(--navy))] bg-[hsl(var(--navy))]/90 shadow-lg overflow-visible transition-all duration-500 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <Link to="/" className={btnBase} aria-label="Home">
        <span className={labelBase}>Home</span>
        <Home className="h-5 w-5" />
      </Link>

      <div className="w-px h-6 bg-white/20" />

      <button onClick={goBack} className={btnBase} aria-label="Go back">
        <span className={labelBase}>Back</span>
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div
        className={`flex items-center transition-all duration-300 ${
          showTop ? 'w-[calc(1px+3rem)] opacity-100' : 'w-0 opacity-0'
        } overflow-visible`}
      >
        <div className="w-px h-6 bg-white/20 shrink-0" />
        <button onClick={scrollToTop} className={`${btnBase} shrink-0`} aria-label="Back to top">
          <span className={labelBase}>Top</span>
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FloatingNavDock;
