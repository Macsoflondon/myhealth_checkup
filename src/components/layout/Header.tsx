import { ErrorBoundary } from "../common/ErrorBoundary";
import BrowseByCategoryBar from "./BrowseByCategoryBar";

interface HeaderProps {
  className?: string;
}

/**
 * Legacy header wrapper kept for pages that have not yet moved to MainLayout.
 * It now renders the current Browse by Category toolbar, not the retired
 * StickyCategoryBar.
 */
const Header = ({ className }: HeaderProps) => {
  return (
    <ErrorBoundary>
      <div className={className}>
        <BrowseByCategoryBar variant="flush" />
      </div>
    </ErrorBoundary>
  );
};

export default Header;
