import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentList from "../components/CommentList";
import CommentInput from "../components/CommentInput";
import Header from "../components/Header";
import useAuth from "../contexts/auth/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchPosts from "../hooks/useFetchPosts";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import PostFormModal from "../components/PostFormModal";
import ReactionBar from "../components/ReactionButtons";
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

const PostPage = () => {
  const { createPost, updatePost, deletePost } = useFetchPosts();
  const { user } = useAuth();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    mode: "add",
    post: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    postId: null,
  });

  const openDeleteConfirm = (postId) =>
    setDeleteConfirm({ isOpen: true, postId });
  const closeModal = () => setModal({ isOpen: false, mode: "add", post: null });

  const closeDeleteConfirm = () =>
    setDeleteConfirm({ isOpen: false, postId: null });

  const openEditModal = (postToEdit) => {
    setTitle(postToEdit.title);
    setDescription(postToEdit.description);
    setImageFile(null);
    setImagePreview(postToEdit.mediaUrl);
    setError(null);
    setModal({ isOpen: true, mode: "edit", post: postToEdit });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (imageFile) {
        formData.append("media", imageFile);
      } else if (
        modal.mode === "edit" &&
        imagePreview &&
        typeof imagePreview === "string"
      ) {
        //
      }

      if (modal.mode === "add") {
        await createPost(formData);
        toast.success("Post added successfully", { position: "top-right" });
      } else if (modal.mode === "edit") {
        await updatePost(modal.post._id, formData);
        toast.success("Post updated successfully", { position: "top-right" });
      }

      fetchPost();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(err.response?.data?.message || "An error occurred", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    setSubmitting(true);
    try {
      await deletePost(deleteConfirm.postId);
      closeDeleteConfirm();
      toast.success("Post deleted successfully", { position: "top-right" });
      navigate("/feed");
    } catch (err) {
      toast.error("Failed to delete post", { position: "top-right" });
      console.error("Delete error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchPost = async () => {
    setPageLoading(true);
    try {
      const res = await axios.get(`/posts/${id}`);
      setPost(res.data.data);
      setComments(res.data.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch post:", err);
      if (err.response && err.response.status === 404) {
        navigate("/404");
      }
      setPost(null);
    } finally {
      setPageLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleReact = async (type) => {
    try {
      await axios.post(`/posts/${post._id}/reactions`, { type });
      const updatedPost = await axios.get(`/posts/${post._id}`);
      setPost(updatedPost.data.data);
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // Loading and Not Found states
  if (pageLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <span className="loading loading-spinner loading-lg text-purple-600"></span>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] text-gray-700 text-xl">
          Post not found.
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Single Post Card (re-using styles from PostCard component logic) */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                {/* Replace with actual user.profilePicture if available */}
                <FaUserCircle className="text-white text-xl" />
              </div>
              <div>
                <span className="block text-gray-800 font-semibold text-base">
                  {post.author.username}
                </span>
                <span className="block text-gray-500 text-xs">
                  {moment(post.createdAt).fromNow()}
                </span>
              </div>
            </div>
            {/* Edit and Delete Icons */}
            {user?.userId === post.author._id && (
              <div className="flex space-x-3 text-gray-500">
                <button
                  onClick={() => openEditModal(post)}
                  className="hover:text-purple-600 transition-colors cursor-pointer"
                  aria-label="Edit Post"
                >
                  <FaRegEdit size={20} />
                </button>
                <button
                  onClick={() => openDeleteConfirm(post._id)}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                  aria-label="Delete Post"
                >
                  <FaRegTrashAlt size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Shared From (if applicable) */}
          {post.sharedFrom && (
            <p className="text-xs font-medium text-gray-600 italic mb-3">
              <FaShareAlt className="inline-block mr-1 text-purple-500" />{" "}
              Shared from {post.sharedFrom.author.username}
            </p>
          )}

          {/* Post Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h2>

          {/* Post Media (Image/Video) */}
          {post.mediaUrl && (
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
              {post.mediaUrl.endsWith(".mp4") ? (
                <video
                  controls
                  className="w-full h-auto max-h-[500px] object-contain"
                >
                  <source src={post.mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={post.mediaUrl}
                  alt={post.title}
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              )}
            </div>
          )}

          {/* Post Content/Description */}
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            {post.description}
          </p>

          {/* Reaction Summary and Action Buttons Row */}
          <div className="flex items-center justify-between text-gray-600 text-sm mb-4 border-b border-gray-200 pb-3">
            <div className="flex items-center space-x-4">
              {/* Reaction Summary (Like, Love, Funny) */}
              {Object.entries(post.reactions.summary || {}).length > 0 ? (
                Object.entries(post.reactions.summary || {}).map(
                  ([type, count]) => (
                    <span key={type} className="flex items-center space-x-1">
                      {type === "like" && (
                        <FaThumbsUp className="text-blue-500" />
                      )}
                      {type === "love" && <FaHeart className="text-red-500" />}
                      {type === "funny" && (
                        <FaLaughSquint className="text-yellow-500" />
                      )}
                      <span>{count}</span>
                    </span>
                  )
                )
              ) : (
                <span className="text-gray-500">No reactions yet</span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Comments Count */}
              <span className="flex items-center space-x-1">
                <FaCommentDots />
                <span>{comments?.length || 0} Comments</span>
              </span>

              {/* Share Button (if not explicitly handled in ReactionBar) */}
              <button
                onClick={() => {
                  toast.info("Share functionality coming soon!");
                }}
                className="flex items-center space-x-1 cursor-pointer hover:text-purple-600 transition-colors"
              >
                <FaShareAlt />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Reaction Buttons Bar (Like, Comment, Share buttons) */}
          <ReactionBar post={post} onReact={handleReact} />
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>
          <CommentInput postId={post._id} onCommentAdded={handleCommentAdded} />
          <div className="mt-4">
            <CommentList comments={comments} />
          </div>
        </div>
      </div>

      {/* Add/Edit Post Modal */}
      {modal.isOpen && (
        <PostFormModal
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          imageFile={imageFile}
          setImageFile={setImageFile}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          error={error}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={closeModal}
          heading={modal.mode === "edit" ? "Edit Post" : "Create New Post"}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm.isOpen && (
        <DeleteConfirmModal
          onClose={closeDeleteConfirm}
          onConfirm={handleDeletePost}
          submitting={submitting}
        />
      )}
    </>
  );
};

export default PostPage;
