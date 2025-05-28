import { Link, NavLink } from "react-router-dom";
import useAuth from "../contexts/auth/useAuth";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-blue-50 shadow-sm px-4">
      <div className="flex-1">
        <NavLink to="/feed" className="text-xl font-bold text-primary">
          Socialo
        </NavLink>
      </div>

      <div className="flex-none space-x-4">
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            isActive
              ? "text-l font-bold text-blue-900 "
              : "btn btn-ghost text-blue-600"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "text-l font-bold bg-blue-900"
              : "btn btn-ghost text-blue-600"
          }
        >
          Profile
        </NavLink>
        {user && (
          <button
            onClick={logout}
            className="btn btn-outline btn-sm bg-blue-50"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
