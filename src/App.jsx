import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeFeed from "./components/Home.jsx";
import CreatePost from "./components/CreatePost";
import PostDetails from "./components/PostDetails";
import EditPost from "./components/EditPost";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:postId" element={<PostDetails />} />
        <Route path="/edit-post/:postId" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;
