import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../lib/authApi';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await loginUser(email, password);
      useAuthStore.getState().login(email);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F3FF] relative overflow-hidden">
      <div className="fixed w-[460px] h-[460px] rounded-full bg-[#EFEAFF] blur-[70px] opacity-50 -top-40 -right-30" />
      <div className="fixed w-[380px] h-[380px] rounded-full bg-[#E3FBF0] blur-[70px] opacity-50 -bottom-36 -left-24" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm bg-white/50 backdrop-blur-lg border border-white/80 rounded-3xl p-8 shadow-lg"
      >
        <h1 className="font-display text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="font-mono text-xs text-[#6B6485] mb-6">Log in to your tracker</p>

        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="block text-xs font-mono text-[#6B6485] mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-xl bg-white/70 border border-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
        />

        <label className="block text-xs font-mono text-[#6B6485] mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-3 py-2 rounded-xl bg-white/70 border border-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 text-white text-sm font-medium shadow-lg shadow-violet-300/40 disabled:opacity-60"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>

        <p className="text-xs font-mono text-[#6B6485] text-center mt-5">
          No account? <Link to="/register" className="text-violet-600">Register</Link>
        </p>
      </form>
    </div>
  );
}