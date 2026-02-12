import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const PageNavButtons = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/') return null;

  return (
    <div className="fixed top-[180px] right-8 z-40 flex flex-col gap-2">
      <Link
        to="/"
        className="h-10 w-10 rounded-full bg-[#22c0d4] hover:bg-[#e70d69] text-white shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110"
        aria-label="Home"
      >
        <Home className="h-5 w-5" />
      </Link>
      <button
        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
        className="h-10 w-10 rounded-full bg-[#22c0d4] hover:bg-[#e70d69] text-white shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PageNavButtons;
