import { useLocation } from "react-router-dom";

/**
 * Global ambient background layer — navy with turquoise/pink glow orbs.
 * Rendered behind every route except the homepage. Section backgrounds
 * cover it where they exist; shows through on empty/transparent areas.
 */
const GlobalPageBackground = () => {
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#081129]"
    >
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#22c0d4]/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#e70d69]/10 blur-[120px]" />
    </div>
  );
};

export default GlobalPageBackground;
