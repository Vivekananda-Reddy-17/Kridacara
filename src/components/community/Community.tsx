import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Trophy, Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  user_id: string;
  content: string;
  achievement_id?: string;
  assessment_id?: string;
  likes: number;
  comments: number;
  created_at: string;
  profiles: {
    display_name: string;
    avatar_url?: string;
  };
  assessment_results?: {
    score: number;
    answers: any;
  };
}

export function Community() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await supabase
        .from('posts')
        .select(`
          id,
          user_id,
          content,
          achievement_id,
          assessment_id,
          likes,
          comments,
          created_at,
          profiles!inner(display_name, avatar_url),
          assessment_results(score, answers)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPost.trim()) return;

    setPosting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: newPost.trim(),
          likes: 0,
          comments: 0
        });

      if (!error) {
        setNewPost('');
        loadPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPosting(false);
    }
  };

  const likePost = async (postId: string, currentLikes: number) => {
    try {
      await supabase
        .from('posts')
        .update({ likes: currentLikes + 1 })
        .eq('id', postId);

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sports Community
          </h1>
          <p className="text-lg text-gray-600">
            Share achievements and connect with fellow athletes
          </p>
        </div>

        {/* Create Post */}
        <Card className="p-6 mb-8">
          <form onSubmit={createPost} className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">
                  {user?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Share your latest achievement or training update..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!newPost.trim()}
                loading={posting}
                icon={Plus}
              >
                Share Post
              </Button>
            </div>
          </form>
        </Card>

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading community posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your achievements with the community!
            </p>
            <Button onClick={() => navigate('/assessment')}>
              Take Assessment
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {post.profiles.display_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {post.profiles.display_name || 'Anonymous'}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 mb-4">{post.content}</p>
                    
                    {/* Assessment Achievement */}
                    {post.assessment_results && (
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <Trophy className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              New Assessment Score: {post.assessment_results.score}/100
                            </p>
                            <p className="text-sm text-gray-600">
                              {post.assessment_results.answers?.test_type && 
                                `${post.assessment_results.answers.test_type.replace('-', ' ')} - ${post.assessment_results.answers.result} ${post.assessment_results.answers.unit}`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Post Actions */}
                    <div className="flex items-center space-x-6 text-gray-500">
                      <button
                        onClick={() => likePost(post.id, post.likes)}
                        className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                      >
                        <Heart className="h-5 w-5" />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span>{post.comments}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                        <Share2 className="h-5 w-5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to Share Your Progress?
            </h3>
            <p className="text-gray-600 mb-6">
              Complete assessments and share your achievements with the community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/assessment')}>
                Take Assessment
              </Button>
              <Button 
                onClick={() => navigate('/leaderboard')}
                variant="outline"
              >
                View Leaderboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}