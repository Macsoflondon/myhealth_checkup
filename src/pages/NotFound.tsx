import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { logger } from "@/lib/logger";
import PageHeading from "@/components/ui/page-heading";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    logger.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <PageHeading 
            title="404" 
            accent="Page Not Found" 
          />
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto mt-6">
            Oops! We couldn't find the page you were looking for.
          </p>
          <Button asChild size="lg">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
