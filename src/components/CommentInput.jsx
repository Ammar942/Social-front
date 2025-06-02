import axios from "axios";
import { useState } from "react";
import useAuth from "../contexts/auth/useAuth";
import { toast } from "react-toastify";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";

const CommentInput = ({ postId, onCommentAdded }) => {
  const { user, loading: authLoading } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!text.trim()) return;

    if (!user?.userId) {
      toast.error("You must be logged in to comment.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `/posts/${postId}/comments`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newComment = res.data.data;
      onCommentAdded(newComment);
      setText("");
    } catch (err) {
      console.error("Failed to add comment", err);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show a loading spinner if authentication is still loading
  if (authLoading)
    return (
      <div className="flex justify-center items-center py-4">
        <span className="loading loading-spinner loading-md text-purple-600"></span>
      </div>
    );

  return (
    <div className="flex items-center space-x-3 py-2 border-t border-gray-200 mt-4 pt-4">
      {/* User Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center flex-shrink-0">
        <FaUserCircle className="text-white text-lg" />
      </div>

      {/* Comment Input Field */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200"
      />

      {/* Comment Button */}
      <button
        onClick={handleAddComment}
        disabled={loading || !text.trim()}
        className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full shadow-md hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        title="Post Comment"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <FaPaperPlane className="text-lg cursor-pointer" />
        )}
      </button>
    </div>
  );
};

export default CommentInput;
