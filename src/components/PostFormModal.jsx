import { useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const PostFormModal = ({
  title,
  setTitle,
  description,
  setDescription,
  setImageFile,
  imagePreview,
  setImagePreview,
  error,
  submitting,
  onSubmit,
  onClose,
  heading = "Add New Post",
}) => {
  const [currentSelectedFile, setCurrentSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setCurrentSelectedFile(null);
      setImagePreview(null);
      setImageFile(null);
      return;
    }

    const acceptedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const acceptedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
    const isImage = acceptedImageTypes.includes(file.type);
    const isVideo = acceptedVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      toast.error(
        "Please select a valid image (JPG, PNG, GIF, WEBP) or video (MP4, WEBM, OGG) file."
      );
      e.target.value = "";
      setCurrentSelectedFile(null);
      setImagePreview(null);
      setImageFile(null);
      return;
    }

    setCurrentSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
  };

  const handleRemoveImage = () => {
    setCurrentSelectedFile(null);
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div
      className="bg-opacity-70 p-4 fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in-up overflow-y-auto max-h-[90vh]" // Added overflow-y-auto and max-h to prevent modal from overflowing if content is too tall
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors duration-200"
          aria-label="Close modal"
        >
          <FaTimes className="text-2xl" />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          {heading}
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-gray-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-y text-gray-800"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's on your mind?"
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor="fileInput"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-full cursor-pointer hover:bg-purple-700 transition-colors duration-200 shadow-md"
            >
              <FaImage className="mr-2" />
              <span>Choose Media</span>
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {currentSelectedFile && (
              <span className="ml-3 text-sm text-gray-600">
                {currentSelectedFile.name}
              </span>
            )}
          </div>

          {/* Image/Video Preview */}
          {imagePreview && (
            <div className="relative mt-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm flex items-center justify-center h-48 sm:h-64 bg-gray-100">
              {imagePreview.endsWith(".mp4") ? (
                <video
                  controls
                  src={imagePreview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              )}
              {/* Remove Image Button */}
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                aria-label="Remove image"
              >
                <FaTimes size={16} />
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 cursor-pointer text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r cursor-pointer from-purple-600 to-blue-500 text-white rounded-full font-semibold shadow-md hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm"></span>
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
