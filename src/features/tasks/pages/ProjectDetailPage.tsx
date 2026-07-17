// src/features/tasks/pages/ProjectDetailPage.tsx

import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { useAuthStore } from "../../../stores/auth.store";
import { useProjectStore } from "../../../stores/project.store";
import { useTaskStore } from "../../../stores/task.store";
import { Button } from "../../../components/Button";
import { EmptyState } from "../../../components/EmptyState";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { TaskListItem } from "../components/TaskListItem";
import { TaskFormModal } from "../components/TaskFormModal";
import type { Task } from "../../../types/task.types";
import type { TaskFormValues } from "../schemas/task.schema";

function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const { user } = useAuthStore();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, isLoading, fetchTasks, createTask, updateTask, deleteTask, updateTaskStatus } =
    useTaskStore();

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
    <div className="min-h-screen bg-(--color-background) p-8">
      <Link to="/dashboard" className="mb-4 inline-block text-sm text-(--color-primary) hover:underline">
        ← Back to dashboard
      </Link>

      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {project && (
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: project.color }}
              aria-hidden="true"
            />
          )}
          <h1 className="text-xl font-semibold text-(--color-text)">
            {project?.name ?? "Project"}
          </h1>
        </div>

        <Button onClick={openCreateForm}>New task</Button>
      </header>

      {!isLoading && tasks.length === 0 && (
        <EmptyState
          title="No Tasks"
          description="Create your first task for this project."
          action={<Button onClick={openCreateForm}>New task</Button>}
        />
      )}

      {tasks.length > 0 && (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
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

      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        title="Delete task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}

export default ProjectDetailPage;