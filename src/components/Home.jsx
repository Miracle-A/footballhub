import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabaseClient";

function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("created_at.desc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      let query = supabase.from("posts").select("*");

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (sortOrder === "created_at.desc") {
        query = query.order("created_at", { ascending: false });
      } else if (sortOrder === "upvotes.desc") {
        query = query.order("upvotes", { ascending: false });
      } else if (sortOrder === "created_at.asc") {
        query = query.order("created_at", { ascending: true });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    }

    fetchPosts();
  }, [sortOrder, searchQuery]);

  return (
    <div>
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
        <div className="flex justify-between py-4">
          <input
            type="text"
            placeholder="Search by title"
            className="flex-grow p-2 border rounded border-gray-300"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setSortOrder("created_at.desc")}
            className="bg-teal-500 hover:bg-teal-700 text-white px-4 py-2 rounded ml-4"
          >
            Newest
          </button>
          <button
            onClick={() => setSortOrder("created_at.asc")}
            className="bg-teal-500 hover:bg-teal-700 text-white px-4 py-2 rounded ml-4"
          >
            Oldest
          </button>
          <button
            onClick={() => setSortOrder("upvotes.desc")}
            className="bg-teal-500 hover:bg-teal-700 text-white px-4 py-2 rounded ml-4"
          >
            Most Popular
          </button>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Link
              to={`/post/${post.id}`}
              key={post.id}
              className="block max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-5"
            >
              <div className="md:flex">
                <div className="p-8">
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-600">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                  <p className="text-gray-500">{post.content}</p>
                  <p className="text-teal-500">{post.upvotes || 0} upvotes</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center">No posts found.</p>
        )}
      </div>
    </div>
  );
}

export default HomeFeed;
