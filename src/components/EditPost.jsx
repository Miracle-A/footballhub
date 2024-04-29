import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import supabase from "../supabaseClient";

function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "", image_url: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPostForEdit();
  }, [postId]);

  async function fetchPostForEdit() {
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      setLoading(false);
    } else {
      setPost({
        title: data.title,
        content: data.content,
        image_url: data.image_url,
      });
      setLoading(false);
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { title, content, image_url } = post;

    const { error } = await supabase
      .from("posts")
      .update({ title, content, image_url })
      .match({ id: postId });

    if (error) {
      console.error("Error updating post:", error);
    } else {
      navigate(`/post/${postId}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <header className="bg-teal-500 p-6 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">FootballHub</h1>
          <nav>
            <Link to="/" className="px-4 py-2 hover:bg-teal-600 rounded">
              Home
            </Link>
            <Link to="/create" className="px-4 py-2 hover:bg-teal-600 rounded">
              Create New Post
            </Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Update A Post</h1>
        <form onSubmit={handleEditSubmit} className="max-w-2xl mx-auto">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="image_url"
          >
            Image URL
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={post.image_url}
            onChange={(e) => setPost({ ...post, image_url: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          />

          <button
            type="submit"
            className="bg-teal-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Post
          </button>
        </form>
      </div>
    </>
  );
}

export default EditPost;
