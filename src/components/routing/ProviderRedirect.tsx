import { Navigate, useParams, useLocation } from "react-router-dom";

interface ProviderRedirectProps {
  from: string;
  to: string;
}

/**
 * Redirects from one provider path to another while preserving the testId param
 * Example: /randox-health/123 -> /randox/123
 */
export default function ProviderRedirect({ from, to }: ProviderRedirectProps) {
  const { testId } = useParams<{ testId: string }>();
  const location = useLocation();
  
  const newPath = `/${to}/${testId || ''}${location.search}`;
  
  return <Navigate to={newPath} replace />;
}
