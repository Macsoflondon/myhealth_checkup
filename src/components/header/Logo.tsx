import { Link } from "react-router-dom";
export const Logo = () => {
  return <Link to="/" className="flex items-center gap-2" aria-label="Health & Wellness Hub Home">
      <div className="h-8 w-8 flex items-center justify-center">
        <img src="/lovable-uploads/cf27880d-e5ac-446c-b06e-05e37748f644.png" alt="MyHealthCheckup Logo" className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex flex-col text-white">
        <span className="font-semibold text-montserrat text-lg leading-tight text-left text-black">myhealth</span>
        <span className="font-semibold text-montserrat text-lg leading-tight text-[#22c0d4]">checkup</span>
      </div>
    </Link>;
};