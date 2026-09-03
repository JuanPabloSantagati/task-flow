import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client.js";

interface Board {
  id: string;
  title: string;
}

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadBoards() {
    const res = await apiFetch("/boards");
    if (!res.ok) {
      setError("Could not load boards.");
      return;
    }
    const data = await res.json();
    setBoards(data.boards);
  }

  useEffect(() => {
    loadBoards();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const res = await apiFetch("/boards", { method: "POST", body: JSON.stringify({ title }) });
    if (!res.ok) {
      setError("Could not create board.");
      return;
    }
    setTitle("");
    await loadBoards();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Your boards</h1>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {boards.length === 0 ? (
        <p className="mb-6 text-sm text-slate-500">
          No boards yet — create your first one below.
        </p>
      ) : (
        <ul className="mb-8 grid gap-3 sm:grid-cols-2">
          {boards.map((board) => (
            <li key={board.id}>
              <Link
                to={`/boards/${board.id}`}
                className="block rounded-lg border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 shadow-sm transition hover:border-brand-500 hover:shadow"
              >
                {board.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleCreate}
        className="flex max-w-md items-end gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex-1">
          <label
            htmlFor="new-board-title"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            New board
          </label>
          <input
            id="new-board-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}
