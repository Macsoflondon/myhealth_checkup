import { ErrorBoundary } from "../common/ErrorBoundary";
import PromoTicker from "../sections/PromoTicker";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <ErrorBoundary>
      <div className={className}>
        <PromoTicker />
      </div>
    </ErrorBoundary>
  );
};

export default Header;
