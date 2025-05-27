const PostCard = ({ post, user, openEditPopup, openDeleteConfirm }) => {
  return (
    <div className="card bg-blue-100 shadow-md p-4 w-full max-w-md h-[500px] overflow-hidden flex flex-col justify-items-center justify-between">
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
              onClick={() => openEditPopup(post)}
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
            <video controls className="w-full max-h-96 object-contain rounded">
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

      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>👍 {post.reactions?.total || 0} reactions</span>
        <span>💬 {post.comments?.length || 0} comments</span>
      </div>
    </div>
  );
};

export default PostCard;
