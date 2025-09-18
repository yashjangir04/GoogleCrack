import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">GC</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                GoogleCrack
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/jobs"
              className={`${
                user.isAdmin ? "hidden" : ""
              } text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Jobs
            </Link>
            <Link
              to="/applications"
              className={`${
                user.isAdmin ? "hidden" : ""
              } text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              My Applications
            </Link>
            <Link
              to="/profile"
              className={`${
                user.isAdmin ? "hidden" : ""
              } text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Profile
            </Link>
            <Link
              to="/saved"
              className={`${
                user.isAdmin ? "hidden" : ""
              } text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Saved Jobs
            </Link>
            <Link
              to="/admin"
              className={`${
                !user.isAdmin ? "hidden" : ""
              } text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              Admin Panel
            </Link>
          </div>

          {/* User Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <div
                  className={`bg-gradient-to-r ${
                    user.isAdmin
                      ? "from-red-500 to-red-600"
                      : "from-blue-500 to-purple-500"
                  } h-8 w-8 rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-medium text-sm">
                    {user?.firstName?.charAt(0).toUpperCase()}
                    {user?.lastName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {user?.firstName.charAt(0).toUpperCase() + user?.firstName.slice(1 , user?.firstName.length)} {user?.lastName.charAt(0).toUpperCase() + user?.lastName.slice(1 , user?.lastName.length)}
                </span>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              to="/jobs"
              className={`${
                isAdmin ? "hidden" : ""
              } text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium`}
            >
              Jobs
            </Link>
            <Link
              to="/applications"
              className={`${
                isAdmin ? "hidden" : ""
              } text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium`}
            >
              My Applications
            </Link>
            <Link
              to="/profile"
              className={`${
                isAdmin ? "hidden" : ""
              } text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium`}
            >
              Profile
            </Link>
            <Link
              to="/saved"
              className={`${
                isAdmin ? "hidden" : ""
              } text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium`}
            >
              Saved Jobs
            </Link>
            <Link
              to="/saved"
              className={`${
                !isAdmin ? "hidden" : ""
              } text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium`}
            >
              Admin Panel
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
