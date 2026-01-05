/**
 * Legacy ClinicMap component - now redirects to ClinicFinder
 * This file is kept for backwards compatibility
 */

import ClinicFinder from "./ClinicFinder";

const ClinicMap = () => {
  return <ClinicFinder />;
};

export default ClinicMap;
