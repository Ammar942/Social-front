import { useEffect, useState } from "react";
import useAuth from "../contexts/auth/useAuth";
import axios from "axios";
import { useParams } from "react-router-dom";
import DeleteCommentModal from "./DeleteCommentModal";

const CommentList = ({ comments: initialComments, fetchComments }) => {
  const { user } = useAuth();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [comments, setComments] = useState(initialComments || []);
  const { id } = useParams();
  useEffect(() => {
    // fetchComments();
    setComments(initialComments || []);
  }, [initialComments]);
  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditedText(comment.text);
  };

  const handleSave = async () => {
    const res = await axios.patch(`posts/${id}/comments/${editingCommentId}`, {
      text: editedText,
    });
    console.log(res);
    const updatedComment = res.data.data;
    setComments((prev) =>
      prev.map((c) => (c._id === editingCommentId ? updatedComment : c))
    );
    setEditingCommentId(null);
  };
  const handleCancel = () => {
    setEditingCommentId(null);
    setEditedText("");
  };
  const handleDelete = async (commentId) => {
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
  if (!comments?.length)
    return <p className="text-gray-500">No comments yet.</p>;

  return (
    <>
      <div className="mt-2 space-y-2">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-violet-950 text-white p-2 rounded shadow-sm flex justify-between items-start"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {comment.author?.username || "Anonymous"}
              </p>
              {editingCommentId === comment._id ? (
                <>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="text-sm w-full border rounded p-1"
                  />
                  <button
                    onClick={handleSave}
                    className="text-blue-600 text-sm mt-1 cursor-pointer hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-red-600 text-sm mt-1 cursor-pointer ms-5 hover:underline"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <p className="text-sm line-clamp-1">{comment.text}</p>
              )}
            </div>

            {user?.userId === comment.author?._id && (
              <div className="flex gap-2 ml-2 mt-1">
                <button
                  onClick={() => handleEdit(comment)}
                  className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm"
                  title="Edit Comment"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-red-600 cursor-pointer hover:text-red-800 text-sm"
                  title="Delete Comment"
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
