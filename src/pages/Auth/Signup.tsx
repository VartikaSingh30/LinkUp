import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { Briefcase } from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (usernameAvailable === false) {
      setError('Username is already taken');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName, username);
    if (error) {
      setError((error as any).message || 'Failed to sign up');
      setLoading(false);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-indigo-600 p-3 rounded-lg">
              <Briefcase className="text-white" size={32} />
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">LinkUp</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Join LinkUp</h1>
          <p className="text-gray-600 text-center mb-6">Create your account today</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
                {checkingUsername && <span className="text-xs text-gray-500 ml-2">(checking...)</span>}
                {usernameAvailable === true && <span className="text-xs text-green-600 ml-2">✓ Available</span>}
                {usernameAvailable === false && <span className="text-xs text-red-600 ml-2">✗ Taken</span>}
              </label>
              <input
                type="text"
                value={username}
                onChange={async (e) => {
                  const value = e.target.value;
                  setUsername(value);
                  if (value.length >= 3) {
                    setCheckingUsername(true);
                    const { data } = await supabase
                      .from('profiles')
                      .select('id')
                      .eq('username', value)
                      .single();
                    setUsernameAvailable(!data);
                    setCheckingUsername(false);
                  } else {
                    setUsernameAvailable(null);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0302CS210001 or any unique username"
                minLength={3}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Suggested format: 0302CS + your ID. Must be unique and at least 3 characters.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
