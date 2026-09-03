import { useDraggable } from "@dnd-kit/core";

interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  order: number;
}

export default function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab select-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm active:cursor-grabbing"
    >
      {task.title}
    </div>
  );
}

export type { Task };
