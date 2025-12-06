import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PostCard } from '../components/PostCard';

interface SearchResult {
  type: 'user' | 'post';
  data: any;
}

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'people'>('posts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    const searchTerm = `%${query}%`;

    const [postsData, usersData] = await Promise.all([
      supabase
        .from('posts')
        .select('*, profiles(full_name, headline, profile_image_url)')
        .ilike('content', searchTerm)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', searchTerm)
        .limit(50),
    ]);

    const combined: SearchResult[] = [
      ...(postsData.data?.map((post) => ({ type: 'post' as const, data: post })) || []),
      ...(usersData.data?.map((user) => ({ type: 'user' as const, data: user })) || []),
    ];

    setResults(combined);
    setLoading(false);
  };

  const posts = results.filter((r) => r.type === 'post').map((r) => r.data);
  const people = results.filter((r) => r.type === 'user').map((r) => r.data);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-600">
          {results.length} results for "<strong>{query}</strong>"
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'posts'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('people')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'people'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          People ({people.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading results...</div>
      ) : activeTab === 'posts' ? (
        <div>
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {people.length > 0 ? (
            people.map((person) => (
              <div key={person.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex gap-3 mb-4">
                  {person.profile_image_url ? (
                    <img src={person.profile_image_url} alt="" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500" />
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">{person.full_name}</h3>
                {person.headline && <p className="text-sm text-gray-600 mb-2">{person.headline}</p>}
                {person.bio && <p className="text-sm text-gray-500 line-clamp-3">{person.bio}</p>}
              </div>
            ))
          ) : (
            <div className="text-center py-12 col-span-2">
              <p className="text-gray-500">No people found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
