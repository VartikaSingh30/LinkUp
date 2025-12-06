import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  profiles?: {
    full_name: string;
    headline?: string;
    profile_image_url?: string;
  };
}

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPostData();
  }, [post.id, user?.id]);

  const loadPostData = async () => {
    if (!user) return;

    const [likesData, commentsData, likeCheckData] = await Promise.all([
      supabase.from('post_likes').select('id', { count: 'exact' }).eq('post_id', post.id),
      supabase
        .from('post_comments')
        .select('id, content, user_id, created_at, profiles(full_name, profile_image_url)', { count: 'exact' })
        .eq('post_id', post.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .maybeSingle(),
    ]);

    setLikes(likesData.count || 0);
    setComments(commentsData.count || 0);
    setPostComments(commentsData.data || []);
    setIsLiked(!!likeCheckData.data);
  };

  const toggleLike = async () => {
    if (!user) return;

    if (isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id);
      setLikes(Math.max(0, likes - 1));
    } else {
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: user.id });
      setLikes(likes + 1);
    }

    setIsLiked(!isLiked);
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    setLoading(true);

    const { data } = await supabase
      .from('post_comments')
      .insert({ post_id: post.id, user_id: user.id, content: commentText })
      .select('*, profiles(full_name, profile_image_url)')
      .single();

    if (data) {
      setPostComments([data, ...postComments]);
      setComments(comments + 1);
      setCommentText('');
    }

    setLoading(false);
  };

  const deletePost = async () => {
    if (!user || user.id !== post.user_id) return;

    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    await supabase.from('posts').delete().eq('id', post.id);
    onDelete?.(post.id);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 hover:border-gray-300 transition">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="flex gap-3 flex-1 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate(`/profile/${post.user_id}`)}
        >
          {post.profiles?.profile_image_url && (
            <img src={post.profiles.profile_image_url} alt="" className="w-12 h-12 rounded-full object-cover" />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 hover:text-indigo-600">{post.profiles?.full_name}</h3>
            {post.profiles?.headline && <p className="text-sm text-gray-500">{post.profiles.headline}</p>}
            <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
          </div>
        </div>
        {user?.id === post.user_id && (
          <button onClick={deletePost} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.image_url && (
        <img src={post.image_url} alt="" className="w-full rounded-lg mb-4 max-h-96 object-cover" />
      )}

      <div className="flex gap-4 text-gray-500 text-sm mb-4 py-2 border-t border-b border-gray-100">
        <button className="hover:text-indigo-600 font-medium">{likes} Likes</button>
        <button onClick={() => setShowComments(!showComments)} className="hover:text-indigo-600 font-medium">
          {comments} Comments
        </button>
        <button className="hover:text-indigo-600 font-medium">Share</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={toggleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${
            isLiked ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          <MessageCircle size={18} />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition">
          <Share2 size={18} />
          Share
        </button>
      </div>

      {showComments && (
        <div className="space-y-4 border-t pt-4">
          <form onSubmit={addComment} className="flex gap-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !commentText.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-300 font-medium transition"
            >
              Post
            </button>
          </form>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {postComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {comment.profiles?.profile_image_url && (
                  <img
                    src={comment.profiles.profile_image_url}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className="flex-1 bg-gray-100 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900">{comment.profiles?.full_name}</p>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
