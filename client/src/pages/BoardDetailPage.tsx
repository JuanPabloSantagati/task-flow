import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { apiFetch } from "../api/client.js";
import KanbanColumn from "../components/KanbanColumn.js";
import type { Task } from "../components/TaskCard.js";

const COLUMNS: { status: Task["status"]; title: string }[] = [
  { status: "TODO", title: "To do" },
  { status: "IN_PROGRESS", title: "In progress" },
  { status: "DONE", title: "Done" },
];

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    const res = await apiFetch(`/boards/${id}/tasks`);
    if (!res.ok) {
      setError("Could not load tasks.");
      return;
    }
    const data = await res.json();
    setTasks(data.tasks);
  }

  useEffect(() => {
    loadTasks();
  }, [id]);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    const res = await apiFetch(`/boards/${id}/tasks`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      setError("Could not add task.");
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
      setError("Could not update task.");
      return;
    }
    await loadTasks();
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleAddTask}>
        <label htmlFor="new-task-title">New task</label>
        <input id="new-task-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <DndContext onDragEnd={handleDragEnd}>
        {COLUMNS.map((col) => (
          <KanbanColumn key={col.status} status={col.status} title={col.title} tasks={tasks} />
        ))}
      </DndContext>
    </div>
  );
}
