import { Navigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  return <Navigate to={`/health-dashboard${location.search}`} replace />;
};

export default Dashboard;
