import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';
import { SlOptionsVertical } from "react-icons/sl";

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editedComment, setEditedComment] = useState('');
  const [userId, setUserId] = useState(null); // Logged-in user ID
  const [user, setUser] = useState(null); // Logged-in user ID
  const [videoOwnerId, setVideoOwnerId] = useState(null); // Video owner ID
  const [menuOpen, setMenuOpen] = useState(null); // Toggle options menu
  const [isFocused, setIsFocused] = useState(false); // Focus state for comment input

  // Fetch video owner, user, and comments
  useEffect(() => {
    const fetchVideoOwner = async () => {
      try {
        const videoResponse = await axios.get(`http://localhost:5000/api/videos/${videoId}`);
        setVideoOwnerId(videoResponse.data.user._id);
      } catch (error) {
        console.error('Error fetching video owner:', error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserId(response.data._id);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/${videoId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchVideoOwner();
    fetchUser();
    fetchComments();
  }, [videoId]);

  // Submit a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/comments/${videoId}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      // Add the user data to the new comment so it displays correctly
      const newCommentWithUser = {
        ...response.data,
        user: user  // Add the current user data to the new comment
      };
      
      // Update comments state with the new comment at the top
      setComments(prevComments => [newCommentWithUser, ...prevComments]);
      setNewComment('');
      setIsFocused(false); // Optionally close the comment input after posting
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  // Edit a comment
  const handleEdit = async (commentId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { content: editedComment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Make sure we keep the user data when updating the comment
      const updatedComment = {
        ...response.data,
        user: comments.find(c => c._id === commentId)?.user
      };

      setComments(comments.map(comment =>
        comment._id === commentId ? updatedComment : comment
      ));
      setEditingComment(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  // Delete a comment
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">{comments.length} Comments</h3>

      {/* Comment Input Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex items-start gap-4">
        <img 
          src={user?.channels?.channelLogo || `/user.png`}
          alt="user" 
          className="w-12 h-12 rounded-full" 
        />
        <div className="flex flex-col w-full items-end gap-4">
          <input
            type="text"
            placeholder={!isFocused && "Add a comment..."}
            className="w-full p-2 group focus:outline-none border-b focus:border-b-2 focus:border-white"
            value={newComment}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {isFocused && (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsFocused(false);
                  setNewComment('');
                }}
                className="text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className={`${!newComment.trim() ? 'bg-red-600/30 border-2 border-red-600/30' : 'bg-red-600/50 border-2 border-red-600'} text-white px-4 py-2 rounded-full cursor-pointer`}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => {
          const isCommentAuthor = userId === comment.user?._id;
          const isVideoOwner = userId === videoOwnerId;

          return (
            <div key={comment._id} className="flex items-start justify-between gap-4 px-8 mb-4">
              <div className="flex items-start gap-4">
                <img 
                  src={comment?.user?.channels?.channelLogo|| `/user.png`} 
                  alt="user" 
                  className="w-10 h-10 rounded-full" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{comment.user?.username || 'Anonymous'}</p>
                    <p className="text-gray-300 text-sm">
                      {formatDistanceToNowStrict(new Date(comment.createdAt))}
                      {comment.updatedAt > comment.createdAt && (
                        <span className="text-gray-400 text-xs ml-1">(Edited)</span>
                      )}
                    </p>
                  </div>
                  {editingComment === comment._id ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        className="w-full bg-gray-700 rounded-lg px-3 py-1"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => handleEdit(comment._id)}
                          className="bg-green-600 text-white px-4 py-1 rounded-full"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingComment(null)}
                          className="bg-gray-500 text-white px-4 py-1 rounded-full"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-200 mt-1">{comment.content}</p>
                  )}
                </div>
              </div>

              {/* Options Menu (for comment author or video owner) */}
              {(isCommentAuthor || isVideoOwner) && (
                <div className="relative">
                  <SlOptionsVertical 
                    onClick={() => setMenuOpen(menuOpen === comment._id ? null : comment._id)} 
                    className="w-5 h-5 cursor-pointer" 
                  />
                  {menuOpen === comment._id && (
                    <div className="absolute -top-10 right-10 mt-8 w-32 bg-gray-500/50 rounded-lg shadow-lg overflow-hidden">
                      <ul>
                        {(isCommentAuthor || isVideoOwner) && (
                          <li
                            onClick={() => {
                              setEditingComment(comment._id);
                              setEditedComment(comment.content);
                              setMenuOpen(null);
                            }}
                            className="px-4 py-2 hover:bg-gray-500 cursor-pointer"
                          >
                            Edit
                          </li>
                        )}
                        {(isCommentAuthor || isVideoOwner) && (
                          <li
                            onClick={() => handleDelete(comment._id)}
                            className="px-4 py-2 hover:bg-gray-500 cursor-pointer"
                          >
                            Delete
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}