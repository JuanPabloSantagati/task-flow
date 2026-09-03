import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import AppHeader from "./AppHeader.js";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <p className="p-8 text-center text-sm text-slate-500">Loading...</p>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
