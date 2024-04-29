import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import supabase from "../supabaseClient";

function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  async function fetchPostDetails() {
    setLoading(true);

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(
        `
          *,
          comments ( id, comment_text, created_at )
        `
      )
      .eq("id", postId)
      .single();

    if (postError) {
      console.error("Error fetching post:", postError);
    } else {
      setPost(postData);
      setComments(postData.comments);
    }

    setLoading(false);
  }

  const handleUpvote = async () => {
    const { error } = await supabase
      .from("posts")
      .update({ upvotes: post.upvotes + 1 })
      .match({ id: postId });

    if (error) {
      console.error("Error upvoting post:", error);
    } else {
      fetchPostDetails();
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const { error } = await supabase
      .from("comments")
      .insert([{ post_id: postId, comment_text: commentText }]);

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setCommentText("");
      fetchPostDetails();
    }
  };

  const deleteComment = async (commentId) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .match({ id: commentId });

    if (error) {
      console.error("Error deleting comment:", error);
    } else {
      fetchPostDetails();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  const confirmDeletion = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(postId);
    }
  };

  const deletePost = async (postId) => {
    console.log("Attempting to delete post with ID:", postId);

    const { error } = await supabase
      .from("posts")
      .delete()
      .match({ id: postId });

    if (error) {
      console.error("Error deleting post:", error);
    } else {
      console.log("Post deleted successfully");
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Back to posts
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="w-full mb-4" />
      )}
      <p className="mb-4">{post.content}</p>
      <button
        onClick={handleUpvote}
        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mt-2 mx-2"
      >
        👍 Upvote {post.upvotes}
      </button>
      <Link
        to={`/edit-post/${postId}`}
        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-2 mx-2"
      >
        Edit Post
      </Link>
      <button
        onClick={() => confirmDeletion(post.id)}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 mx-2"
      >
        Delete Post
      </button>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Comments:</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-t pt-2">
              <p>{comment.comment_text}</p>
              <small>
                Posted on {new Date(comment.created_at).toLocaleString()}
              </small>
              <button
                onClick={() => deleteComment(comment.id)}
                className="text-red-500 hover:text-red-700 font-bold py-1 px-2 ml-4 rounded"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}

        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            className="border rounded w-full p-2"
            placeholder="Leave a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostDetails;
