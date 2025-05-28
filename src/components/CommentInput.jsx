import axios from "axios";
import { useState } from "react";
import useAuth from "../contexts/auth/useAuth";
import { toast } from "react-toastify";

const CommentInput = ({ postId, onCommentAdded }) => {
  const { user, loading: authLoading } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!text.trim()) return;
    console.log(user);
    if (!user?.userId) {
      toast.error("You must be logged in to comment.");
      return;
    }
    setLoading(true);
    try {
      console.log(`Adding comment to post ${postId}:`, text);
      const res = await axios.post(
        `/posts/${postId}/comments`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      const newComment = await res.data;

      onCommentAdded(newComment);
      setText("");
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setLoading(false);
    }
  };
  if (authLoading)
    return <div className="loading loading-spinner loading-md"></div>;
  return (
    <div className="flex items-center gap-2 mt-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 border rounded px-3 py-1 text-sm"
      />
      <button
        onClick={handleAddComment}
        disabled={loading || !text.trim()}
        className="px-3 py-1 cursor-pointer bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          "Comment"
        )}
      </button>
    </div>
  );
};

export default CommentInput;
