import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import Header from "../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../contexts/auth/useAuth";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import PostFormModal from "../components/PostFormModal";
import useFetchPosts from "../hooks/useFetchPosts";
const ProfilePage = () => {
  const { user } = useAuth();
  const { createPost, updatePost, deletePost } = useFetchPosts();
  const [originalPosts, setOriginalPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for PostFormModal and DeleteConfirmModal (copied from PostPage for consistency)
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

  const fetchProfilePosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/posts/profile");
      setOriginalPosts(res.data.data.originalPosts || []);
      setSharedPosts(res.data.data.sharedPosts || []);
    } catch (err) {
      console.error("Failed to load profile posts:", err);
      toast.error("Failed to load your posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfilePosts();
  }, [user]);

  // Handlers for PostFormModal and DeleteConfirmModal (copied from PostPage)
  const openDeleteConfirm = (postId) =>
    setDeleteConfirm({ isOpen: true, postId });
  const closeModal = () => {
    setModal({ isOpen: false, mode: "add", post: null });
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };
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
      if (imageFile) formData.append("media", imageFile);

      if (modal.mode === "add") {
        await createPost(formData);
        toast.success("Post added successfully", { position: "top-right" });
      } else if (modal.mode === "edit") {
        await updatePost(modal.post._id, formData);
        toast.success("Post updated successfully", { position: "top-right" });
      }

      fetchProfilePosts();
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
      fetchProfilePosts();
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
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 pb-8">
        {/* Profile Header Section */}
        <div className="bg-gradient-to-r from-purple-700 to-blue-600 text-white py-12 px-4 shadow-lg text-center">
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            {/* Profile Picture */}
            <div className="w-28 h-28 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white shadow-xl mb-4">
              {/* Replace with actual user.profilePicture if available */}
              <FaUserCircle className="text-black text-7xl" />
            </div>
            {/* Username */}
            <h1 className="text-4xl font-extrabold mb-2">
              {user?.username || "Guest User"}
            </h1>
            {/* User Email/Bio (Optional) */}
            <p className="text-gray-200 text-lg mb-4">
              {user?.email || "Connect and share your moments!"}
            </p>
            {/* Edit Profile Button (Placeholder) */}
            <button
              onClick={() => toast.info("Edit Profile coming soon!")}
              className="flex items-center space-x-2 px-6 py-2 bg-white text-purple-700 rounded-full font-semibold shadow-md hover:bg-gray-100 transition-all duration-300"
            >
              <FaEdit className="text-lg" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="loading loading-spinner loading-lg text-purple-600"></span>
            </div>
          ) : (
            <>
              {/* Original Posts Section */}
              <section className="mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-purple-500 pb-2">
                  <span className="text-purple-600">Your</span> Creations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {originalPosts.length === 0 ? (
                    <p className="text-gray-500 text-lg md:col-span-3 text-center py-8">
                      You haven’t created any posts yet.
                    </p>
                  ) : (
                    originalPosts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        user={user}
                        openEditPopup={openEditModal}
                        openDeleteConfirm={openDeleteConfirm}
                        // openShareModal={openShareModal}
                      />
                    ))
                  )}
                </div>
              </section>

              {/* Shared Posts Section */}
              <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                  <span className="text-blue-600">Posts</span> You Shared
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sharedPosts.length === 0 ? (
                    <p className="text-gray-500 text-lg md:col-span-3 text-center py-8">
                      You haven’t shared any posts yet.
                    </p>
                  ) : (
                    sharedPosts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        user={user}
                        openEditPopup={openEditModal}
                        openDeleteConfirm={openDeleteConfirm}
                        // openShareModal={openShareModal}
                      />
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
      {/* Modals */}
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

export default ProfilePage;
