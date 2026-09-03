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
      <h1>Your boards</h1>
      {error && <p role="alert">{error}</p>}
      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <Link to={`/boards/${board.id}`}>{board.title}</Link>
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreate}>
        <label htmlFor="new-board-title">New board</label>
        <input
          id="new-board-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
