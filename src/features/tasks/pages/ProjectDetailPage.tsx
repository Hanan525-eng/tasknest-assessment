// src/features/tasks/pages/ProjectDetailPage.tsx

import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ListTodo, Search } from "lucide-react";

import { useAuthStore } from "../../../stores/auth.store";
import { useProjectStore } from "../../../stores/project.store";
import { useTaskStore } from "../../../stores/task.store";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { EmptyState } from "../../../components/EmptyState";
import { CardSkeleton } from "../../../components/Skeleton";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { TaskListItem } from "../components/TaskListItem";
import { TaskFormModal } from "../components/TaskFormModal";
import { KanbanBoard } from "../components/KanbanBoard";
import type { Task } from "../../../types/task.types";
import type { TaskFormValues } from "../schemas/task.schema";

type TaskView = "list" | "kanban";

function ProjectDetailPage() {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  const { user } = useAuthStore();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, isLoading, fetchTasks, createTask, updateTask, deleteTask, updateTaskStatus } =
    useTaskStore();

  const [view, setView] = useState<TaskView>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (user && projects.length === 0) {
      fetchProjects(user.id);
    }
  }, [user, projects.length, fetchProjects]);

  useEffect(() => {
    if (projectId) fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tasks;
    return tasks.filter((task) => task.title.toLowerCase().includes(query));
  }, [tasks, searchQuery]);

  if (!projectId) {
    return <Navigate to="/dashboard" replace />;
  }

  const openCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: TaskFormValues) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      createTask(projectId, data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  return (
    <div>
      <Link
        to="/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-sm text-(--color-primary) hover:underline"
      >
        <span className="rtl:rotate-180" aria-hidden="true">←</span>
        {t("common.backToDashboard")}
      </Link>

      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {project && (
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: project.color }}
              aria-hidden="true"
            />
          )}
          <h1 className="text-xl font-semibold text-(--color-text)">
            {project?.name ?? ""}
          </h1>
        </div>

        <Button onClick={openCreateForm}>{t("task.newTask")}</Button>
      </header>

      {tasks.length > 0 && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit rounded-sm border border-(--color-border) p-0.5">
            <button
              type="button"
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              className={
                "rounded-sm px-3 py-1 text-sm font-medium " +
                (view === "list"
                  ? "bg-(--color-primary) text-white"
                  : "text-(--color-text-muted)")
              }
            >
              {t("task.view.list")}
            </button>
            <button
              type="button"
              onClick={() => setView("kanban")}
              aria-pressed={view === "kanban"}
              className={
                "rounded-sm px-3 py-1 text-sm font-medium " +
                (view === "kanban"
                  ? "bg-(--color-primary) text-white"
                  : "text-(--color-text-muted)")
              }
            >
              {t("task.view.kanban")}
            </button>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-(--color-text-muted)"
            />
            <Input
              label={t("task.searchPlaceholder")}
              hideLabel
              placeholder={t("task.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9"
            />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!isLoading && tasks.length === 0 && (
        <EmptyState
          icon={<ListTodo size={24} />}
          title={t("task.emptyTitle")}
          description={t("task.emptyDescription")}
          action={<Button onClick={openCreateForm}>{t("task.newTask")}</Button>}
        />
      )}

      {!isLoading && tasks.length > 0 && filteredTasks.length === 0 && (
        <EmptyState icon={<Search size={24} />} title={t("task.noResults")} />
      )}

      {!isLoading && filteredTasks.length > 0 && view === "list" && (
        <div className="flex flex-col gap-3">
          {filteredTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              onStatusChange={updateTaskStatus}
              onEdit={openEditForm}
              onDelete={setDeletingTask}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredTasks.length > 0 && view === "kanban" && (
        <KanbanBoard
          tasks={filteredTasks}
          onStatusChange={updateTaskStatus}
          onEdit={openEditForm}
          onDelete={setDeletingTask}
        />
      )}

      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        title={t("task.delete.title")}
        message={t("task.delete.message", { title: deletingTask?.title ?? "" })}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}

export default ProjectDetailPage;

