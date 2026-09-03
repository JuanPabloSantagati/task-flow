import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link to="/boards" className="text-lg font-semibold text-slate-900">
          Task Flow
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          {user && <span>{user.name}</span>}
          <button
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-3 py-1 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
