import { useState, useRef, useEffect } from "react";
import { FaSort, FaFire, FaCalendarAlt, FaCommentDots } from "react-icons/fa";

const SortDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to handle sorting and close dropdown
  const handleSortSelect = (sortOption) => {
    setSortBy(sortOption);
    setIsOpen(false);
  };

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative inline-block text-left mb-6 z-10"
      ref={dropdownRef}
    >
      {" "}
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-md shadow-md hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100 cursor-pointer transition-all duration-200"
        >
          <FaSort className="w-4 h-4 mr-2" />
          Sort Posts
        </button>
      </div>
      {/* Dropdown content - conditionally rendered */}
      {isOpen && (
        <ul className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none p-1">
          <li>
            <button
              onClick={() => handleSortSelect("date")}
              className={`flex items-center w-full cursor-pointer px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-600 transition-colors duration-200 ${
                sortBy === "date"
                  ? "font-semibold text-purple-600 bg-gray-50"
                  : ""
              }`}
            >
              <FaCalendarAlt className="w-4 h-4 mr-2" /> Newest
            </button>
          </li>

          <li>
            <button
              onClick={() => handleSortSelect("reactions")}
              className={`flex items-center w-full cursor-pointer px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-600 transition-colors duration-200 ${
                sortBy === "reactions"
                  ? "font-semibold text-purple-600 bg-gray-50"
                  : ""
              }`}
            >
              <FaFire className="w-4 h-4 mr-2" /> Popular
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSortSelect("comments")}
              className={`flex items-center w-full cursor-pointer px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-600 transition-colors duration-200 ${
                sortBy === "comments"
                  ? "font-semibold text-purple-600 bg-gray-50"
                  : ""
              }`}
            >
              <FaCommentDots className="w-4 h-4 mr-2" /> Most Discussed
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSortSelect("oldest")}
              className={`flex items-center w-full cursor-pointer px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-600 transition-colors duration-200 ${
                sortBy === "oldest"
                  ? "font-semibold text-purple-600 bg-gray-50"
                  : ""
              }`}
            >
              <FaCalendarAlt className="w-4 h-4 mr-2" /> Oldest
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
