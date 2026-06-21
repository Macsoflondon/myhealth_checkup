import { ErrorBoundary } from "../common/ErrorBoundary";
import StickyCategoryBar from "./StickyCategoryBar";

interface HeaderProps {
  className?: string;
}

/**
 * Global page header. Renders the sticky category toolbar on every page.
 * The PromoTicker carousel has been retired.
 */
const Header = ({ className }: HeaderProps) => {
  return (
    <ErrorBoundary>
      <div className={className}>
        <StickyCategoryBar />
      </div>
    </ErrorBoundary>
  );
};

export default Header;
