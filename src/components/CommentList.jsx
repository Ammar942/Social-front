import { useEffect, useState } from "react";
import useAuth from "../contexts/auth/useAuth";
import axios from "axios";
import { useParams } from "react-router-dom";
import DeleteCommentModal from "./DeleteCommentModal";
import { FaRegEdit, FaRegTrashAlt, FaUserCircle } from "react-icons/fa";
import moment from "moment";

const CommentList = ({ comments: initialComments, fetchComments }) => {
  const { user } = useAuth();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [comments, setComments] = useState(initialComments || []);
  const { id } = useParams();

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditedText(comment.text);
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(
        `posts/${id}/comments/${editingCommentId}`,
        {
          text: editedText,
        }
      );
      const updatedComment = res.data.data;
      setComments((prev) =>
        prev.map((c) => (c._id === editingCommentId ? updatedComment : c))
      );
      setEditedText("");
      setEditingCommentId(null);
    } catch (err) {
      console.error("Error saving comment:", err);
    }
  };

  const handleCancel = () => {
    setEditingCommentId(null);
    setEditedText("");
  };

  const handleDelete = (commentId) => {
    setCommentToDelete(commentId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`posts/${id}/comments/${commentToDelete}`);
      if (fetchComments) {
        fetchComments();
      }
      setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
    } catch (err) {
      console.error("Error deleting comment", err);
    }
    setShowModal(false);
    setCommentToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setCommentToDelete(null);
  };

  if (!comments || comments.length === 0)
    return <p className="text-gray-500 text-sm italic">No comments yet.</p>;

  return (
    <>
      <div className="space-y-3">
        {" "}
        {/* Increased space between comments */}
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="flex items-start space-x-3 p-3 bg-gray-100 rounded-lg shadow-sm"
          >
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center flex-shrink-0">
              <FaUserCircle className="text-white text-lg" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">
                  {comment.author?.username || "Anonymous"}
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    {moment(comment.createdAt).fromNow()}
                  </span>
                </p>
                {/* Edit and Delete Icons for owner */}
                {user?.userId === comment.author?._id && (
                  <div className="flex space-x-2 text-gray-500">
                    <button
                      onClick={() => handleEdit(comment)}
                      className="hover:text-purple-600 transition-colors cursor-pointer"
                      aria-label="Edit Comment"
                      title="Edit Comment"
                    >
                      <FaRegEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="hover:text-red-600 transition-colors cursor-pointer"
                      aria-label="Delete Comment"
                      title="Delete Comment"
                    >
                      <FaRegTrashAlt size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Text or Edit Input */}
              {editingCommentId === comment._id ? (
                <div className="mt-1">
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    rows="2"
                  />
                  <div className="flex justify-end space-x-2 mt-1">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 cursor-pointer transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded-md hover:bg-gray-400 cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <DeleteCommentModal
        isOpen={showModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default CommentList;
