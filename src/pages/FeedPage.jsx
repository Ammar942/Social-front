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
import { FaPlus } from "react-icons/fa";

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
    if (!user) {
      toast.info("Please log in to share posts.", { position: "top-center" });
      navigate("/login");
      return;
    }
    setShareModal({ isOpen: true, post });
  };

  const closeShareModal = () => setShareModal({ isOpen: false, post: null });

  const handleSharePost = async ({
    title: shareTitle,
    description: shareDescription,
  }) => {
    setSubmitting(true);
    try {
      await sharePost(shareModal.post._id, shareTitle, shareDescription);
      fetchPosts();
      closeShareModal();
      toast.success("Post shared successfully", { position: "top-right" });
    } catch (err) {
      toast.error("Failed to share post", { position: "top-right" });
      console.error("Share error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-start mb-6">
            <Skeleton height={40} width={180} />{" "}
            {/* Skeleton for SortDropdown */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center mb-4">
                    <Skeleton circle={true} height={40} width={40} />
                    <div className="ml-3">
                      <Skeleton width={120} />
                      <Skeleton width={80} height={10} />
                    </div>
                  </div>
                  <Skeleton height={24} width="80%" className="mb-3" />
                  <Skeleton height={200} className="mb-4" />
                  <Skeleton count={2} height={15} />
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton width={150} height={20} />
                    <Skeleton width={80} height={20} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  }

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
      toast.info("Please log in to create posts.", { position: "top-center" });
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
    setImageFile(null);
    setImagePreview(post.mediaUrl);
    setError(null);
    setModal({ isOpen: true, mode: "edit", post });
  };

  // Close Add/Edit modal
  const closeModal = () => {
    setModal({ isOpen: false, mode: "add", post: null });
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };

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

    if (modal.mode === "add" && !imageFile && !imagePreview) {
      setError("Image or video is required for new posts.");
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
      fetchPosts(); // Refresh feed after deletion
      closeDeleteConfirm();
      toast.success("Post deleted successfully", { position: "top-right" });
    } catch (err) {
      toast.error("Failed to delete post", { position: "top-right" });
      console.error("Delete error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Sort Dropdown */}
        <div className="flex justify-start mb-6">
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        {/* Error Message */}
        {postsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-center">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{postsError}</span>
            <button
              onClick={fetchPosts}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.length === 0 ? (
            <div className="md:col-span-3 text-center py-10 text-gray-600 text-xl">
              No posts available. Be the first to{" "}
              <button
                onClick={openAddModal}
                className="text-purple-600 font-semibold hover:underline focus:outline-none"
              >
                create one!
              </button>
            </div>
          ) : (
            sortedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                openEditPopup={openEditModal}
                openDeleteConfirm={openDeleteConfirm}
                openShareModal={openShareModal}
              />
            ))
          )}
        </div>

        {/* Floating Add Post Button */}
        <button
          onClick={openAddModal}
          className="fixed bottom-8 cursor-pointer right-8 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white text-3xl flex items-center justify-center shadow-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Add New Post"
        >
          <FaPlus className="text-xl" />
        </button>

        {/* Modals */}
        {shareModal.isOpen && (
          <SharePostModal
            onClose={closeShareModal}
            onShare={handleSharePost}
            submitting={submitting}
            post={shareModal.post}
          />
        )}
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
            heading={modal.mode === "add" ? "Create New Post" : "Edit Post"}
          />
        )}
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
