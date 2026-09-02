import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { logoutUser } from '../lib/authApi';
import AddQuestionModal from './AddQuestionModal';

export default function Navbar() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    useAuthStore.getState().logout();
    navigate('/login');
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-mono text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
      isActive
        ? 'bg-violet-500 text-white'
        : 'text-[#6B6485] hover:bg-white/60'
    }`;

  return (
    <>
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg border-b border-white/60">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <p className="font-display font-semibold text-base whitespace-nowrap">Study Tracker</p>
            <nav className="flex gap-1">
              <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
              <NavLink to="/questions" className={linkClass}>Questions</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="font-medium text-xs text-white px-3.5 py-1.5 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 shadow-md shadow-violet-300/40 whitespace-nowrap"
            >
              + Add
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="font-mono text-[11px] text-[#6B6485] px-2.5 py-1.5 rounded-full bg-white/50 border border-white/80 hover:bg-white/70 whitespace-nowrap"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {showAddModal && <AddQuestionModal onClose={() => setShowAddModal(false)} />}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-7 w-full max-w-sm shadow-2xl">
            <h2 className="font-display text-xl font-semibold mb-2">Log out?</h2>
            <p className="font-mono text-xs text-[#6B6485] mb-6">
              You'll need to log in again to access your tracker.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-full bg-white/60 border border-white/90 text-sm font-medium text-[#6B6485]"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-full bg-rose-500 text-white text-sm font-medium shadow-lg shadow-rose-300/40"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}