import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { useLanguage } from "../context/LanguageContext.js";
import { useTheme } from "../context/ThemeContext.js";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link to="/boards" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t.appName}
        </Link>
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            aria-label="Toggle language"
            className="rounded-md border border-slate-300 px-3 py-1 font-medium transition hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md border border-slate-300 px-3 py-1 font-medium transition hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {user && <span>{user.name}</span>}
          <button
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-3 py-1 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {t.logout}
          </button>
        </div>
      </div>
    </header>
  );
}
