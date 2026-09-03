import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { apiFetch } from "../api/client.js";
import { useLanguage } from "../context/LanguageContext.js";
import KanbanColumn from "../components/KanbanColumn.js";
import type { Task } from "../components/TaskCard.js";

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const columns: { status: Task["status"]; title: string }[] = [
    { status: "TODO", title: t.boardDetail.columns.todo },
    { status: "IN_PROGRESS", title: t.boardDetail.columns.inProgress },
    { status: "DONE", title: t.boardDetail.columns.done },
  ];

  async function loadTasks() {
    const res = await apiFetch(`/boards/${id}/tasks`);
    if (!res.ok) {
      setError(t.boardDetail.loadError);
      return;
    }
    const data = await res.json();
    setTasks(data.tasks);
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    const res = await apiFetch(`/boards/${id}/tasks`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      setError(t.boardDetail.addError);
      return;
    }
    setTitle("");
    await loadTasks();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as Task["status"];
    const res = await apiFetch(`/tasks/${active.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      setError(t.boardDetail.updateError);
      return;
    }
    await loadTasks();
  }

  return (
    <div>
      <Link
        to="/boards"
        className="mb-4 inline-block text-sm text-brand-600 hover:underline dark:text-brand-500"
      >
        {t.boardDetail.back}
      </Link>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <form
        onSubmit={handleAddTask}
        className="mb-6 flex max-w-md items-end gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="flex-1">
          <label
            htmlFor="new-task-title"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {t.boardDetail.newTask}
          </label>
          <input
            id="new-task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          {t.boardDetail.add}
        </button>
      </form>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 sm:grid-cols-3">
          {columns.map((col) => (
            <KanbanColumn key={col.status} status={col.status} title={col.title} tasks={tasks} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
