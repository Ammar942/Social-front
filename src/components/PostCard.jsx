import { useEffect, useState } from "react";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactionBar from "./ReactionButtons";
import {
  FaRegEdit,
  FaRegTrashAlt,
  FaShareAlt,
  FaThumbsUp,
  FaHeart,
  FaLaughSquint,
  FaCommentDots,
  FaUserCircle,
} from "react-icons/fa";
import moment from "moment";
import { toast } from "react-toastify";

const PostCard = ({
  post: initialPost,
  user,
  openEditPopup,
  openDeleteConfirm,
  openShareModal,
  // fetchPosts,
}) => {
  const [comments, setComments] = useState(initialPost.comments || []);
  const [post, setPost] = useState(initialPost);
  const navigate = useNavigate();

  const handleSeeMoreComments = () => {
    navigate(`/posts/${post._id}`);
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/posts/${post._id}/comments`);
      setComments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleReact = async (type, setLoading) => {
    if (!user) {
      toast.info("Please log in to react to posts.", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      await axios.post(`/posts/${post._id}/reactions`, { type });
      const updatedPost = await axios.get(`/posts/${post._id}`);
      setPost(updatedPost.data.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to react to the post. Please try again.", {
        position: "top-right",
      });
      setLoading(false);
      console.error("Failed to react:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
    setPost((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment],
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-xl mx-auto mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <FaUserCircle className="text-white text-xl" />
          </div>
          <div>
            <span className="block text-gray-800 font-semibold text-sm">
              {post.author.username}
            </span>
            <span className="block text-gray-500 text-xs">
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
        </div>
        {/* Edit and Delete Icons */}
        {user?.userId === post.author._id && (
          <div className="flex space-x-2 text-gray-500">
            <button
              onClick={() => openEditPopup(post)}
              className="hover:text-purple-600 cursor-pointer transition-colors"
              aria-label="Edit Post"
            >
              <FaRegEdit size={18} />
            </button>
            <button
              onClick={() => openDeleteConfirm(post._id)}
              className="hover:text-red-600 cursor-pointer transition-colors"
              aria-label="Delete Post"
            >
              <FaRegTrashAlt size={18} />
            </button>
          </div>
        )}
      </div>

      <h3 className="text-gray-800 font-medium text-base mb-3">{post.title}</h3>

      {/* Post Media (Image/Video) */}
      {post.mediaUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.mediaUrl.endsWith(".mp4") ? (
            <video controls className="w-full h-auto max-h-96 object-cover">
              <source src={post.mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-auto max-h-96 object-cover"
            />
          )}
        </div>
      )}

      {/* Post Content/Description */}
      <p className="text-gray-700 text-sm mb-4">{post.description}</p>
      {/* Reaction Summary and Action Buttons Row */}
      <div className="flex items-center justify-between text-gray-600 text-sm mb-4 border-b border-gray-200 pb-3">
        {/* Reaction Buttons Bar */}
        <ReactionBar post={post} onReact={handleReact} />
        <div className="flex items-center space-x-4">
          {/* Comments Count */}
          <button
            onClick={handleSeeMoreComments}
            className="flex items-center cursor-pointer space-x-1 hover:text-purple-600 transition-colors"
          >
            <FaCommentDots />
            <span>{comments?.length || 0}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => openShareModal(post)}
            className="flex items-center cursor-pointer space-x-1 hover:text-purple-600 transition-colors"
          >
            <FaShareAlt />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Reaction Summary (Like, Love, Funny) */}
        {/* {Object.entries(post.reactions.summary || {}).map(([type, count]) => (
          <span key={type} className="flex items-center space-x-1">
            {type === "like" && <FaThumbsUp className="text-blue-500" />}
            {type === "love" && <FaHeart className="text-red-500" />}
            {type === "funny" && <FaLaughSquint className="text-yellow-500" />}
            <span>{count}</span>
          </span>
        ))} */}
        {post.reactions.total === 0 && (
          <span className="text-gray-500">No reactions yet</span>
        )}
      </div>
      {/* Comments Section */}
      <div className="mt-4">
        {comments.length > 0 && (
          <CommentList comments={[comments[0]]} fetchComments={fetchComments} />
        )}
        {comments.length > 1 && (
          <button
            onClick={handleSeeMoreComments}
            className="text-purple-600 text-sm hover:underline mt-2 cursor-pointer mb-2 block"
          >
            View all {comments.length} comments
          </button>
        )}
        <CommentInput postId={post._id} onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  );
};

export default PostCard;
