// enable video preview
// enhance ui for sign in and sign up
// enhance ui for profile page
// skeleton loading for profile page
// handle error and empty states for profile page
// clean up code
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import SortDropdown from "../components/SortDropdown";
import PostFormModal from "../components/PostFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import useFetchPosts from "../hooks/useFetchPosts";
import useAuth from "../contexts/auth/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SharePostModal from "../components/SharePostModal";

const FeedPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const {
    error: postsError,
    posts,
    loading,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    sharePost,
  } = useFetchPosts();

  const [sortBy, setSortBy] = useState("date");

  const [modal, setModal] = useState({
    isOpen: false,
    mode: "add",
    post: null,
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    postId: null,
  });
  useEffect(() => {
    if (postsError) {
      toast.error(postsError, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [postsError]);

  // Form states for add/edit modal
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    post: null,
  });
  const openShareModal = (post) => {
    if (!user) return navigate("/login");
    setShareModal({ isOpen: true, post });
  };

  const closeShareModal = () => setShareModal({ isOpen: false, post: null });
  const handleSharePost = async ({ title, description }) => {
    setSubmitting(true);
    try {
      await sharePost(shareModal.post._id, title, description);
      fetchPosts();
      closeShareModal();
      toast.success("Post shared successfully", { position: "top-right" });
    } catch (err) {
      toast.error("Failed to share post", { position: "top-right" });
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };
  if (authLoading || loading)
    return (
      <>
        <div className="w-full ">
          <Skeleton height={60} count={1} className="mb-4" />
        </div>
        <div className="w-[200px] p-4">
          <Skeleton height={40} count={1} className="mb-4" />
        </div>
        <div className="flex flex-col justify-items-center items-center justify-center gap-4">
          <Skeleton height={500} width={484} count={5} />
        </div>
        <div className="rounded-full fixed bottom-8 right-8 w-12 h-12">
          <Skeleton circle={true} height={48} width={48} />
        </div>
      </>
    );

  // Sort helper
  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "reactions":
        return (b.reactions?.total || 0) - (a.reactions?.total || 0);
      case "comments":
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      default:
        return 0;
    }
  });

  // Open Add Post modal
  const openAddModal = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setModal({ isOpen: true, mode: "add", post: null });
  };

  // Open Edit modal with post data
  const openEditModal = (post) => {
    setTitle(post.title);
    setDescription(post.description);
    setImageFile(post.mediaUrl ? post.mediaUrl : null);
    setImagePreview(post.mediaUrl);
    setError(null);
    setModal({ isOpen: true, mode: "edit", post });
  };

  // Close Add/Edit modal
  const closeModal = () => setModal({ isOpen: false, mode: "add", post: null });

  // Open delete confirm modal
  const openDeleteConfirm = (postId) =>
    setDeleteConfirm({ isOpen: true, postId });

  // Close delete modal
  const closeDeleteConfirm = () =>
    setDeleteConfirm({ isOpen: false, postId: null });

  // Handle add/edit form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    if (modal.mode === "add" && !imageFile) {
      setError("Image or video is required.");
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

      fetchPosts();
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

  // Confirm delete post
  const handleDeletePost = async () => {
    setSubmitting(true);
    try {
      await deletePost(deleteConfirm.postId);
      fetchPosts();
      closeDeleteConfirm();
      toast.success("Post deleted successfully", { position: "top-right" });
    } catch {
      // handle error if needed
      toast.error("Failed to delete post", { position: "top-right" });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Header />
      <div className="p-4">
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>
      <div className="container mx-auto p-4 flex flex-col items-center">
        {postsError && (
          <div className="text-red-600 mb-4 mx-auto">
            {postsError}
            <button
              onClick={fetchPosts}
              className="ml-4 px-3 py-1 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}
        <div className="flex flex-col gap-4 justify-center">
          {sortedPosts.length === 0 && (
            <div className="text-blue-800 mx-auto">
              No posts available. Add Post
            </div>
          )}
          {sortedPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              user={user}
              openEditPopup={openEditModal}
              openDeleteConfirm={openDeleteConfirm}
              openShareModal={openShareModal}
              // fetchPosts={fetchPosts}
            />
          ))}
        </div>

        {/* Floating add button */}
        <button
          onClick={openAddModal}
          className="fixed bottom-8 right-8 w-12 h-12 cursor-pointer rounded-full bg-violet-900 text-white text-3xl font-bold flex items-center justify-center shadow-lg hover:bg-blue-700"
          aria-label="Add Post"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="4.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
        {shareModal.isOpen && (
          <SharePostModal
            onClose={closeShareModal}
            onShare={handleSharePost}
            submitting={submitting}
          />
        )}
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
            heading={modal.mode === "add" ? "Add New Post" : "Edit Post"}
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
      </div>
    </>
  );
};

export default FeedPage;
