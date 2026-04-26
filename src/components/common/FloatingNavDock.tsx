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

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate('/'));

  const btnBase =
    'group/btn relative flex items-center justify-center !h-8 !w-8 sm:!h-9 sm:!w-9 rounded-lg border-2 border-[#e70d69] text-[#e70d69] bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-[#e70d69] hover:text-white shadow-md';

  const labelBase =
    'absolute right-full mr-2 px-2 py-1 rounded text-[10px] font-heading font-semibold uppercase tracking-wider bg-brand-navy text-white whitespace-nowrap opacity-0 scale-90 group-hover/btn:opacity-100 group-hover/btn:scale-100 transition-all duration-200 pointer-events-none shadow-md hidden sm:block';

  if (isHome) {
    return (
      <button
        onClick={scrollToTop}
        className={`group/btn fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[60] !h-8 !w-8 sm:!h-9 sm:!w-9 rounded-lg border-2 border-[#e70d69] text-[#e70d69] bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-500 hover:bg-[#e70d69] hover:text-white hover:scale-110 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <span className={labelBase}>Top</span>
        <ArrowUp className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[60] flex flex-col items-center gap-1.5 sm:gap-2 transition-all duration-500 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Top button - appears when scrolled */}
      <div className={`transition-all duration-300 ${
        showTop ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none h-0 -mb-2'
      }`}>
        <button onClick={scrollToTop} className={btnBase} aria-label="Back to top">
          <span className={labelBase}>Top</span>
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      {/* Home */}
      <Link to="/" className={btnBase} aria-label="Home">
        <span className={labelBase}>Home</span>
        <Home className="h-4 w-4" />
      </Link>

      {/* Back */}
      <button onClick={goBack} className={btnBase} aria-label="Go back">
        <span className={labelBase}>Back</span>
        <ArrowLeft className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FloatingNavDock;
