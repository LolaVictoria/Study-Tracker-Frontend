import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { logoutUser } from '../lib/authApi';
import AddQuestionModal from './AddQuestionModal';

export default function Navbar() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const email = useAuthStore((state) => state.email);
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  async function handleLogout() {
    await logoutUser();
    useAuthStore.getState().logout();
    navigate('/login');
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-mono text-xs px-3 py-1.5 rounded-full transition-colors ${
      isActive
        ? 'bg-violet-500 text-white'
        : 'text-[#6B6485] hover:bg-white/60'
    }`;

  return (
    <>
      <div className="sticky top-0 z-40 bg-white/40 backdrop-blur-lg border-b border-white/60">
        <div className="max-w-3xl mx-auto px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <p className="font-display font-semibold text-base">Study Tracker</p>
            <nav className="flex gap-1">
              <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
              <NavLink to="/questions" className={linkClass}>Questions</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <p className="font-mono text-[11px] text-[#6B6485] hidden sm:block">
              Good {greeting}, {email}
            </p>

            <button
              onClick={() => setShowAddModal(true)}
              className="font-medium text-xs text-white px-3.5 py-1.5 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 shadow-md shadow-violet-300/40"
            >
              + Add question
            </button>

            {showLogoutConfirm ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleLogout}
                  className="font-mono text-[11px] text-white px-2.5 py-1.5 rounded-full bg-rose-500"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="font-mono text-[11px] text-[#6B6485] px-2.5 py-1.5 rounded-full bg-white/60 border border-white/80"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="font-mono text-[11px] text-[#6B6485] px-2.5 py-1.5 rounded-full bg-white/50 border border-white/80 hover:bg-white/70"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </div>

      {showAddModal && <AddQuestionModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}