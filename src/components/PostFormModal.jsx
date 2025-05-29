const PostFormModal = ({
  title,
  setTitle,
  description,
  setDescription,
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
  error,
  submitting,
  onSubmit,
  onClose,
  heading = "Add New Post",
}) => {
  console.log(imageFile);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{heading}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              rows="4"
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="fileInput"
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
            >
              Choose Image
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {imagePreview && (
            <div className="mt-2 mb-4">
              {imagePreview.endsWith(".mp4") ? (
                <video
                  controls
                  src={imagePreview}
                  alt="preview"
                  className="max-h-96 w-full object-contain rounded"
                />
              ) : (
                <div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {imageFile ? imageFile.name : "No file chosen"}
                    </span>
                  </div>

                  {(imagePreview || imageFile) && (
                    <img
                      src={imagePreview || imageFile}
                      alt="Preview"
                      className="mt-2 max-h-48 object-contain rounded-lg border"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFormModal;
