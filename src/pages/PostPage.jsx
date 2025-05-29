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
const PostPage = () => {
  const { loading, createPost, updatePost, deletePost } = useFetchPosts();
  const { user } = useAuth();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  //   const [loading, setLoading] = useState(true);
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

  const openEditModal = (post) => {
    setTitle(post.title);
    setDescription(post.description);
    setImageFile(post.mediaUrl ? post.mediaUrl : null);
    setImagePreview(post.mediaUrl);
    setError(null);
    setModal({ isOpen: true, mode: "edit", post });
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
      if (imageFile) formData.append("media", imageFile);

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
    } catch {
      // handle error if needed
      toast.error("Failed to delete post", { position: "top-right" });
    } finally {
      setSubmitting(false);
    }
  };
  const fetchPost = async () => {
    try {
      const res = await axios.get(`/posts/${id}`);
      console.log(res);
      setPost(res.data.data);
      setComments(res.data.data.comments || []);
    } catch (err) {
      console.error(err);
    } finally {
      //   setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
    fetchPost();
  };

  useEffect(() => {
    fetchPost();
  }, [id]);
  const handleReact = async (type) => {
    try {
      await axios.post(`/posts/${post._id}/reactions`, { type });
      const updatedPost = await axios.get(`/posts/${post._id}`);
      setPost(updatedPost.data.data);
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };
  if (loading) return <div>Loading post...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <>
      <Header />

      <div className="card bg-blue-100 shadow-md max-w-2xl mx-auto p-4 flex flex-col justify-items-center justify-between mt-5">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-blue-900">
            {post.author.username}{" "}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        {post.sharedFrom && (
          <span className="text-xs font-semibold text-gray-700 italic ">
            🔁 Shared from {post.sharedFrom.author.username}
          </span>
        )}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold line-clamp-3">{post.title}</h3>

          {user?.userId === post.author._id && (
            <div className="flex gap-2">
              <button
                className="cursor-pointer"
                onClick={() => openEditModal(post)}
                aria-label="Edit Post"
              >
                ✏️
              </button>
              <button
                onClick={() => openDeleteConfirm(post._id)}
                aria-label="Delete Post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="red"
                  className="size-5 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {post.mediaUrl && (
          <>
            {post.mediaUrl.endsWith(".mp4") ? (
              <video
                controls
                className="w-full max-h-96 object-contain rounded"
              >
                <source src={post.mediaUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={post.mediaUrl}
                  alt=""
                  className="object-contain w-full h-full"
                />
              </div>
            )}
          </>
        )}

        <p className="mt-2 text-sm text-gray-600 line-clamp-4">
          {post.description}
        </p>

        <ReactionBar post={post} onReact={handleReact} />
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          {post.reactions.total === 0 && (
            <span className="text-gray-600">No reactions yet</span>
          )}
          <span>
            {Object.entries(post.reactions.summary || {}).map(
              ([type, count]) => (
                <span key={type} className="mr-2">
                  {type === "like" && "👍"}
                  {type === "love" && "❤️"}
                  {type === "funny" && "😂"} {count}
                </span>
              )
            )}
          </span>
        </div>
        <CommentList comments={comments} />
        <CommentInput postId={post._id} onCommentAdded={handleCommentAdded} />
      </div>
      {/* Add/Edit Modal */}
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
          heading={modal.mode === "Edit Post"}
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
