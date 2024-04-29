import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log("Error fetching post", error);
      } else {
        setPost(data);
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id);

      if (error) {
        console.log("Error fetching comments", error);
      } else {
        setComments(data);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from("posts")
      .update({ upvotes: post.upvotes + 1 })
      .eq("id", id);

    if (error) {
      console.log("Error upvoting post", error);
    } else {
      setPost({ ...post, upvotes: data[0].upvotes });
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <img src={post.image_url} alt={post.title} />
      <p>{post.content}</p>
      <button onClick={handleUpvote}>Upvote</button>
      <h3>Comments:</h3>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <p>{new Date(comment.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default PostPage;
