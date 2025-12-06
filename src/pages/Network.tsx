import { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Search as SearchIcon, MessageCircle, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  full_name: string;
  headline?: string;
  profile_image_url?: string;
  bio?: string;
}

interface UserWithFollowStatus extends User {
  isFollowing?: boolean;
}

export function NetworkPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithFollowStatus[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'following'>('discover');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadFollowing();
      loadUsers();
    }
  }, [user, activeTab]);

  const loadFollowing = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('connections')
      .select('following_id')
      .eq('follower_id', user.id);

    setFollowing(new Set(data?.map((c) => c.following_id) || []));
  };

  const loadUsers = async () => {
    if (!user) return;

    setLoading(true);

    let query = supabase
      .from('profiles')
      .select('id, full_name, headline, profile_image_url, bio')
      .neq('id', user.id);

    if (activeTab === 'following') {
      query = query.in(
        'id',
        (await supabase
          .from('connections')
          .select('following_id')
          .eq('follower_id', user.id)).data?.map((c: any) => c.following_id) || []
      );
    }

    if (searchQuery.trim()) {
      query = query.ilike('full_name', `%${searchQuery}%`);
    }

    const { data } = await query.order('full_name');

    setUsers((data || []) as UserWithFollowStatus[]);
    setLoading(false);
  };

  const toggleFollow = async (userId: string) => {
    if (!user) return;

    const isFollowing = following.has(userId);

    if (isFollowing) {
      await supabase.from('connections').delete().eq('follower_id', user.id).eq('following_id', userId);

      setFollowing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } else {
      await supabase
        .from('connections')
        .insert({ follower_id: user.id, following_id: userId });

      setFollowing((prev) => new Set([...prev, userId]));
    }
  };

  const startConversation = async (userId: string) => {
    if (!user) return;
    
    // Navigate to messages page with the selected user
    navigate('/messages', { state: { selectedUserId: userId } });
  };

  const handleCreateGroup = () => {
    // Group creation logic (not connected to database as requested)
    console.log('Group Created:', {
      name: groupName,
      description: groupDescription,
      members: groupMembers,
      createdBy: user?.id
    });
    
    // Show success message
    alert(`Group "${groupName}" created successfully! (Note: This is a UI demo - not saved to database)`);
    
    // Reset form
    setGroupName('');
    setGroupDescription('');
    setGroupMembers([]);
    setShowGroupModal(false);
  };

  const toggleGroupMember = (userId: string) => {
    setGroupMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Network</h1>
          <button
            onClick={() => setShowGroupModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            <Users size={20} />
            <span className="hidden sm:inline">Create Group</span>
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'discover'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'following'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Following
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
              <div 
                className="flex flex-col items-center mb-4 cursor-pointer hover:opacity-80"
                onClick={() => navigate(`/profile/${u.id}`)}
              >
                {u.profile_image_url ? (
                  <img src={u.profile_image_url} alt="" className="w-20 h-20 rounded-full object-cover mb-3" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
                    {u.full_name.charAt(0).toUpperCase()}
                  </div>
                )}

                <h3 className="font-semibold text-gray-900 mb-1 text-center line-clamp-1 hover:text-indigo-600">{u.full_name}</h3>
                {u.headline && <p className="text-sm text-gray-600 mb-2 text-center line-clamp-2">{u.headline}</p>}
                {u.bio && <p className="text-sm text-gray-500 mb-4 text-center line-clamp-2">{u.bio}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleFollow(u.id)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    following.has(u.id)
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {following.has(u.id) ? (
                    <>
                      <UserCheck size={18} />
                      <span className="hidden sm:inline">Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span className="hidden sm:inline">Follow</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => startConversation(u.id)}
                  className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center"
                  title="Send message"
                >
                  <MessageCircle size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </div>
      )}

      {/* Create Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="text-indigo-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Create Group</h2>
              </div>
              <button
                onClick={() => setShowGroupModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Study Group, Project Team"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              {/* Group Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="What's this group about?"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition"
                  rows={3}
                />
              </div>

              {/* Select Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Members ({groupMembers.length} selected)
                </label>
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {users.length === 0 ? (
                    <p className="text-center py-4 text-sm text-gray-500">No users available</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {users.slice(0, 10).map((u) => (
                        <label
                          key={u.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={groupMembers.includes(u.id)}
                            onChange={() => toggleGroupMember(u.id)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          {u.profile_image_url ? (
                            <img 
                              src={u.profile_image_url} 
                              alt={u.full_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-semibold">
                              {u.full_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{u.full_name}</p>
                            {u.headline && <p className="text-xs text-gray-500 truncate">{u.headline}</p>}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select users to add to your group
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowGroupModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
