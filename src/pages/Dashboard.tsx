import { Navigate, useLocation } from "@/lib/router-compat";

const Dashboard = () => {
  const location = useLocation();
  return <Navigate to={`/health-dashboard${location.search}`} replace />;
};

export default Dashboard;
