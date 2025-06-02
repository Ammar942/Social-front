import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../contexts/auth/useAuth";
import { FaHome, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white shadow-md rounded-lg mx-auto mt-4 max-w-7xl">
      {/* Socialo Logo and Text */}
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-full w-10 h-10 flex items-center justify-center">
          {/* Placeholder for Socialo icon, replace with actual SVG if available */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        <Link to="/feed" className="text-xl font-bold text-gray-800">
          Socialo
        </Link>
      </div>

      {/* Navigation Links (Home) */}
      <div className="flex items-center space-x-8">
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `flex items-center space-x-2 text-base font-semibold ${
              isActive
                ? "text-purple-600"
                : "text-gray-600 hover:text-purple-500"
            } transition-colors duration-200`
          }
        >
          <FaHome className="text-xl" />
          <span>Home</span>
        </NavLink>
      </div>

      {/* User Info and Logout */}
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <Link
              to="/profile"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                <FaUserCircle className="text-white text-lg" />
              </div>
              <span className="font-semibold text-gray-800">
                {user.username || "john_doe"}
              </span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-purple-500 font-semibold transition-colors duration-200"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
