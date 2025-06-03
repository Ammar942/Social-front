import { useState } from "react";
import useAuth from "../contexts/auth/useAuth";

const typeToEmoji = {
  like: "👍",
  love: "❤️",
  funny: "😂",
};
const reactionTypes = ["like", "love", "funny"];

const ReactionBar = ({ post, onReact }) => {
  const [reactionsLoading, setReactionsLoading] = useState(false);
  const { user } = useAuth();

  const userId = user?.userId;
  const userReacted = post.reactions.reactions.find((r) => r.user === userId);
  return (
    <div className="flex gap-2 mt-2">
      {reactionTypes.map((type) => {
        const count = post.reactions.summary?.[type] || 0;
        return (
          <button
            key={type}
            onClick={() => {
              onReact(type, setReactionsLoading);
            }}
            aria-label={`React with ${type}`}
            className={`flex items-center gap-1 text-sm cursor-pointer hover:scale-120  ${
              userReacted?.type === type
                ? "text-blue-600 font-bold"
                : "text-gray-600"
            }`}
          >
            {typeToEmoji[type]}{" "}
            {reactionsLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <span>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
export default ReactionBar;
