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

  async function loadTasks() {
    const res = await apiFetch(`/boards/${id}/tasks`);
    const data = await res.json();
    setTasks(data.tasks);
  }

  useEffect(() => {
    loadTasks();
  }, [id]);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    await apiFetch(`/boards/${id}/tasks`, { method: "POST", body: JSON.stringify({ title }) });
    setTitle("");
    await loadTasks();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as Task["status"];
    await apiFetch(`/tasks/${active.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    await loadTasks();
  }

  return (
    <div>
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
