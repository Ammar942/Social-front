import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import Header from "../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../contexts/auth/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();
  const [originalPosts, setOriginalPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfilePosts = async () => {
      try {
        const res = await axios.get("/posts/profile");
        console.log(res);
        setOriginalPosts(res.data.data.originalPosts || []);
        setSharedPosts(res.data.data.sharedPosts || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load profile posts");
      } finally {
        setLoading(false);
      }
    };
    fetchProfilePosts();
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Your Posts</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Original Posts */}
            <section className="mb-8 ">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-3">Created by You</h2>
                {originalPosts.length === 0 ? (
                  <p className="text-gray-500">
                    You haven’t posted anything yet.
                  </p>
                ) : (
                  originalPosts.map((post) => (
                    <PostCard key={post._id} post={post} user={user} />
                  ))
                )}
              </div>
            </section>

            {/* Shared Posts */}
            <section className="">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-3">Posts You Shared</h2>
                {sharedPosts.length === 0 ? (
                  <p className="text-gray-500">No shared posts yet.</p>
                ) : (
                  sharedPosts.map((post) => (
                    <PostCard key={post._id} post={post} user={user} />
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
