import { useState, useEffect } from "react";
import axios from "axios";

const useFetchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchPosts = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get("/posts");
      setPosts(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      setError("Failed to fetch posts ");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (formData) =>
    axios.post("/posts/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  const updatePost = async (id, formData) =>
    axios.patch(`/posts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  const deletePost = async (id) => axios.delete(`/posts/${id}`);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
};

export default useFetchPosts;
