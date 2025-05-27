// import { useEffect, useState } from "react";
// import Header from "../components/Header";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../contexts/auth/useAuth";

// const FeedPage = () => {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();

//   const [posts, setPosts] = useState([]);
//   const [sortBy, setSortBy] = useState("date");

//   // Modal state
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Form state
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const [postToEdit, setPostToEdit] = useState(null);
//   const [postToDelete, setPostToDelete] = useState(null);

//   useEffect(() => {
//     if (!loading) {
//       fetchPosts();
//     }
//   }, [user, loading]);

//   const fetchPosts = async () => {
//     try {
//       const res = await axios.get("/posts");
//       setPosts(res.data.data);
//       console.log(res.data.data);
//       console.log(user);
//     } catch (err) {
//       console.error("Error fetching posts", err);
//     }
//   };

//   const sortedPosts = [...posts].sort((a, b) => {
//     switch (sortBy) {
//       case "date":
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       case "oldest":
//         return new Date(a.createdAt) - new Date(b.createdAt);
//       case "reactions":
//         return (b.reactions?.total || 0) - (a.reactions?.total || 0);
//       case "comments":
//         return (b.comments?.length || 0) - (a.comments?.length || 0);
//       default:
//         return 0;
//     }
//   });
//   const openEditPopup = (post) => {
//     setPostToEdit(post);
//     setTitle(post.title);
//     setDescription(post.description);
//     setImagePreview(post.mediaUrl || null);
//     setImageFile(null);
//     setIsEditOpen(true);
//   };

//   const openDeleteConfirm = (postId) => {
//     setPostToDelete(postId);
//     setIsDeleteConfirmOpen(true);
//   };
//   // Open modal or navigate to login
//   const handleAddClick = () => {
//     setTitle("");
//     setDescription("");
//     setImageFile(null);
//     setImagePreview(null);
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     setIsModalOpen(true);
//   };
//   // Edit Post Handler
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!title.trim() || !description.trim()) {
//       setError("Title and description are required");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", description);
//       if (imageFile) formData.append("media", imageFile);

//       await axios.patch(`/posts/${postToEdit._id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       closeModals();
//       setTitle("");
//       setDescription("");
//       setImageFile(null);
//       setImagePreview(null);
//       fetchPosts();
//     } catch (err) {
//       console.error(err);
//       setError("Failed to update post");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Delete Post Handler
//   const handleDeleteSubmit = async () => {
//     if (!postToDelete) return;
//     setSubmitting(true);
//     try {
//       await axios.delete(`/posts/${postToDelete}`);
//       closeModals();
//       fetchPosts();
//     } catch (err) {
//       console.error("Failed to delete post", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const closeModals = () => {
//     setIsEditOpen(false);
//     setIsDeleteConfirmOpen(false);
//     setPostToEdit(null);
//     setPostToDelete(null);
//   };

//   // Handle image file select & preview
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);
//     if (file) {
//       setImagePreview(URL.createObjectURL(file));
//     } else {
//       setImagePreview(null);
//     }
//   };

//   // Submit new post (just example, adjust API and logic as needed)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!title.trim() || !description.trim()) {
//       setError("Title and description are required");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       // Prepare form data for image upload if needed
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", description);
//       if (imageFile) {
//         formData.append("media", imageFile);
//       }
//       console.log(formData);
//       // Example API call - change the endpoint & method if different
//       await axios.post("/posts/create", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // After successful post creation:
//       setIsModalOpen(false);
//       setTitle("");
//       setDescription("");
//       setImageFile(null);
//       setImagePreview(null);
//       fetchPosts(); // refresh posts
//     } catch (err) {
//       console.error(err);
//       setError("Failed to create post");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Header />

//       <div className="p-4">
//         <div className="dropdown mb-4">
//           <label tabIndex={0} className="btn m-1 bg-blue-100">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="w-6 h-6 inline-block mr-1"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
//               />
//             </svg>
//             Filter Posts
//           </label>
//           <ul
//             tabIndex={0}
//             className="dropdown-content z-[1] menu p-2 shadow bg-blue-50 rounded-box w-52"
//           >
//             <li>
//               <button
//                 onClick={() => setSortBy("date")}
//                 className={sortBy === "date" ? "font-bold text-blue-600" : ""}
//               >
//                 🗓️ Date (Newest)
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setSortBy("oldest")}
//                 className={sortBy === "oldest" ? "font-bold text-blue-600" : ""}
//               >
//                 🕒 Date (Oldest)
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setSortBy("reactions")}
//                 className={
//                   sortBy === "reactions" ? "font-bold text-blue-600" : ""
//                 }
//               >
//                 👍 Reactions
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setSortBy("comments")}
//                 className={
//                   sortBy === "comments" ? "font-bold text-blue-600" : ""
//                 }
//               >
//                 💬 Comments
//               </button>
//             </li>
//           </ul>
//         </div>

//         <div className="flex justify-center">
//           <main className="space-y-4">
//             {sortedPosts.map((post) => (
//               <div
//                 key={post._id}
//                 className="card bg-blue-100 shadow-md p-4 w-full max-w-md h-[500px] overflow-hidden flex flex-col justify-items-center justify-between"
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-semibold text-blue-900">
//                     {post.author.username}
//                   </span>
//                   <span className="text-sm text-gray-500">
//                     {new Date(post.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//                 {post.sharedFrom && (
//                   <span className="text-xs font-semibold text-gray-700 italic ">
//                     🔁 Shared from {post.sharedFrom.author.username}
//                   </span>
//                 )}
//                 <div className="flex justify-between items-start">
//                   <h3 className="text-lg font-bold line-clamp-3">
//                     {post.title}
//                   </h3>

//                   {user?.userId === post.author._id && (
//                     <div className="flex gap-2">
//                       <button
//                         className="cursor-pointer"
//                         onClick={() => openEditPopup(post)}
//                       >
//                         ✏️
//                       </button>
//                       <button onClick={() => openDeleteConfirm(post._id)}>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           strokeWidth={1.5}
//                           stroke="red"
//                           className="size-5 cursor-pointer"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {post.mediaUrl && (
//                   <>
//                     {post.mediaUrl.endsWith(".mp4") ? (
//                       <video
//                         controls
//                         className="w-full max-h-96 object-contain rounded"
//                       >
//                         <source src={post.mediaUrl} type="video/mp4" />
//                       </video>
//                     ) : (
//                       <div className="aspect-w-16 aspect-h-9">
//                         <img
//                           src={post.mediaUrl}
//                           alt=""
//                           className="object-contain w-full h-full"
//                         />
//                       </div>
//                     )}
//                   </>
//                 )}
//                 <p className="mt-2 text-sm text-gray-600 line-clamp-4">
//                   {post.description}
//                 </p>
//                 <div className="mt-4 flex justify-between text-sm text-gray-500">
//                   <span>👍 {post.reactions?.total || 0} reactions</span>
//                   <span>💬 {post.comments?.length || 0} comments</span>
//                 </div>
//               </div>
//             ))}
//           </main>
//         </div>
//       </div>

//       {/* Floating Add Button */}
//       <button
//         onClick={handleAddClick}
//         className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded-full w-14 h-14 flex  items-center justify-center shadow-lg text-3xl select-none"
//         title="Add New Post"
//         aria-label="Add New Post"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke-width="1.5"
//           stroke="currentColor"
//           class="size-6"
//         >
//           <path
//             stroke-linecap="round"
//             stroke-linejoin="round"
//             d="M12 4.5v15m7.5-7.5h-15"
//           />
//         </svg>
//       </button>

//       {/* Modal */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
//           onClick={() => {
//             setTitle("");
//             setDescription("");
//             setImageFile(null);
//             setImagePreview(null);
//             setIsModalOpen(false);
//           }}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//               Add New Post
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block mb-1 font-semibold">Title</label>
//                 <input
//                   type="text"
//                   className="input input-bordered w-full"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                   maxLength={100}
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-semibold">Description</label>
//                 <textarea
//                   className="textarea textarea-bordered w-full"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   required
//                   rows={4}
//                   maxLength={500}
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-semibold">Upload Image</label>

//                 <div className="flex items-center gap-4">
//                   {/* This label acts as the button */}
//                   <label
//                     htmlFor="fileInput"
//                     className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
//                   >
//                     Choose Image
//                   </label>

//                   {/* Show selected file name or fallback text */}
//                   <span className="text-sm text-gray-600">
//                     {imageFile ? imageFile.name : "No file chosen"}
//                   </span>
//                 </div>

//                 <input
//                   id="fileInput"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />

//                 {imagePreview && (
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="mt-2 max-h-48 object-contain rounded-lg border"
//                   />
//                 )}
//               </div>

//               {error && (
//                 <p className="text-red-600 text-sm font-semibold">{error}</p>
//               )}

//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   className="px-4 py-2 border cursor-pointer border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
//                   onClick={() => setIsModalOpen(false)}
//                   disabled={submitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                   disabled={submitting}
//                 >
//                   {submitting ? (
//                     <span className="loading loading-spinner loading-md"></span>
//                   ) : (
//                     "Post"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {isEditOpen && postToEdit && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
//           onClick={closeModals}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//               Edit Post
//             </h2>
//             <form onSubmit={handleEditSubmit} className="space-y-4">
//               <div>
//                 <label className="block mb-1 font-semibold">Title</label>
//                 <input
//                   type="text"
//                   className="input input-bordered w-full"
//                   value={title || postToEdit.title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                   maxLength={100}
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-semibold">Description</label>
//                 <textarea
//                   className="textarea textarea-bordered w-full"
//                   value={description || postToEdit.description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   required
//                   rows={4}
//                   maxLength={500}
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-semibold">
//                   Change Image (optional)
//                 </label>
//                 <div className="flex items-center gap-4">
//                   {/* This label acts as the button */}
//                   <label
//                     htmlFor="fileInput"
//                     className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
//                   >
//                     Choose Image
//                   </label>

//                   {/* Show selected file name or fallback text */}
//                   <span className="text-sm text-gray-600">
//                     {imageFile ? imageFile.name : "No file chosen"}
//                   </span>
//                 </div>

//                 <input
//                   id="fileInput"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//                 {(imagePreview || postToEdit.mediaUrl) && (
//                   <img
//                     src={imagePreview || postToEdit.mediaUrl}
//                     alt="Preview"
//                     className="mt-2 max-h-48 object-contain rounded-lg border"
//                   />
//                 )}
//               </div>
//               {error && <p className="text-red-600 text-sm">{error}</p>}
//               <div className="flex justify-end gap-3 pt-2">
//                 <button
//                   type="button"
//                   className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
//                   onClick={closeModals}
//                   disabled={submitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition"
//                   disabled={submitting}
//                 >
//                   {submitting ? (
//                     <span className="loading loading-spinner loading-md"></span>
//                   ) : (
//                     "Save Changes"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {isDeleteConfirmOpen && postToDelete && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
//           onClick={closeModals}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center relative animate-fade-in"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-2xl font-semibold mb-3 text-gray-800">
//               Confirm Deletion
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this post?
//             </p>

//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={closeModals}
//                 className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteSubmit}
//                 className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//               >
//                 {submitting ? (
//                   <span className="loading loading-spinner loading-md"></span>
//                 ) : (
//                   " Delete"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default FeedPage;
// add reactions and comments and share functionality
// make sort outer function
// profile page
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
            />
          ))}
        </div>

        {/* Floating add button */}
        <button
          onClick={openAddModal}
          className="fixed bottom-8 right-8 w-12 h-12 cursor-pointer rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center shadow-lg hover:bg-blue-700"
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
