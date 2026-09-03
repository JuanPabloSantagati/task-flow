import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DndContext } from "@dnd-kit/core";
import KanbanColumn from "../src/components/KanbanColumn.js";

describe("KanbanColumn", () => {
  it("renders its title and task cards", () => {
    render(
      <DndContext>
        <KanbanColumn
          status="TODO"
          title="To do"
          tasks={[{ id: "1", title: "Write plan", status: "TODO", order: 0 }]}
        />
      </DndContext>
    );
    expect(screen.getByText("To do")).toBeInTheDocument();
    expect(screen.getByText("Write plan")).toBeInTheDocument();
  });
});
