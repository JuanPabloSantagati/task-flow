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
    <div ref={setNodeRef}>
      <h2>{title}</h2>
      {columnTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
