
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">404</h1>
        <p className="text-xl mb-8 text-gray-600">We couldn't find the page you're looking for</p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
