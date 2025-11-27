// pages/NotFound.js
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl space-y-6">
        <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          404
        </div>
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-gray-400 text-lg">
          Oops! The page you're looking for has vanished into the digital void.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium
                      hover:opacity-90 transition-opacity"
          >
            Return to Safety
          </Link>
        </div>
        <div className="mt-12 opacity-60 text-sm">
          <span className="mr-2">🚀</span>
          Pro tip: Our navigation menu might have what you need
        </div>
      </div>
    </div>
  );
};

export default NotFound;
