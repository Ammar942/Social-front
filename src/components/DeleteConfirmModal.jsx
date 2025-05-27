const DeleteConfirmModal = ({ onClose, onConfirm, submitting }) => (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
      <p className="mb-6 text-gray-700">
        You won't be able to undo this action.
      </p>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="btn btn-ghost">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="btn btn-error"
          disabled={submitting}
        >
          {submitting ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;
