import { useDroppable } from "@dnd-kit/core";
import TaskCard, { type Task } from "./TaskCard.js";

interface Props {
  status: "TODO" | "IN_PROGRESS" | "DONE";
  title: string;
  tasks: Task[];
}

export default function KanbanColumn({ status, title, tasks }: Props) {
  const { setNodeRef } = useDroppable({ id: status });
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <div className="flex min-h-[16rem] flex-col rounded-lg bg-slate-100 p-3 dark:bg-slate-800/60" ref={setNodeRef}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </h2>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {columnTasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {columnTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
