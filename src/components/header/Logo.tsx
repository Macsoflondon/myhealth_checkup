
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="My Health & Wellness Hub Home">
      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-health-500 to-wellness-500 flex items-center justify-center">
        <span className="text-white font-bold text-lg">H</span>
      </div>
      <span className="font-bold text-xl text-health-700">
        My <span className="text-wellness-600">Health & Wellness Hub</span>
      </span>
    </Link>
  );
};
