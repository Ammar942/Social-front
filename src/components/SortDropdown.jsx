const SortDropdown = ({ sortBy, setSortBy }) => (
  <div className="dropdown mb-4">
    <label tabIndex={0} className="btn m-1 bg-blue-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 inline-block mr-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
        />
      </svg>
      Filter Posts
    </label>
    <ul
      tabIndex={0}
      className="dropdown-content z-[1] menu p-2 shadow bg-blue-50 rounded-box w-52"
    >
      <li>
        <button
          onClick={() => setSortBy("date")}
          className={sortBy === "date" ? "font-bold text-blue-600" : ""}
        >
          🗓️ Date (Newest)
        </button>
      </li>
      <li>
        <button
          onClick={() => setSortBy("oldest")}
          className={sortBy === "oldest" ? "font-bold text-blue-600" : ""}
        >
          🕒 Date (Oldest)
        </button>
      </li>
      <li>
        <button
          onClick={() => setSortBy("reactions")}
          className={sortBy === "reactions" ? "font-bold text-blue-600" : ""}
        >
          👍 Reactions
        </button>
      </li>
      <li>
        <button
          onClick={() => setSortBy("comments")}
          className={sortBy === "comments" ? "font-bold text-blue-600" : ""}
        >
          💬 Comments
        </button>
      </li>
    </ul>
  </div>
);

export default SortDropdown;
