// src/components/CreatePost.jsx
import React, { useState } from "react";
import supabase from "../supabaseClient";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [posting, setPosting] = useState(false);

  const handlePostCreation = async (e) => {
    e.preventDefault();
    console.log("Submitting post:", title, content, imageUrl);
    setPosting(true);

    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, content, image_url: imageUrl }]);

    setPosting(false);

    if (error) {
      console.error("Error creating your post:", error);
    } else {
      console.log("Post created successfully:", data);

      setTitle("");
      setContent("");
      setImageUrl("");
    }
  };

  return (
    <div>
      <header className="bg-teal-500 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">FootballHub</h1>
          <nav>
            <a
              href="/"
              className="text-white px-4 py-2 hover:bg-teal-600 rounded"
            >
              Home
            </a>
            <a
              href="/create"
              className="text-white px-4 py-2 hover:bg-teal-600 rounded"
            >
              Create New Post
            </a>
          </nav>
        </div>
      </header>
      <div className="container mx-auto p-6">
        <form
          onSubmit={handlePostCreation}
          className="max-w-xl mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-white"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="content"
            >
              Content (Optional)
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="content"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image-url"
            >
              Image URL (Optional)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image-url"
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={posting}
            >
              {posting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
