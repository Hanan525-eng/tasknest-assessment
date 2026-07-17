// src/features/projects/pages/DashboardPage.tsx

import { useEffect, useState } from "react";
import { useAuthStore } from "../../../stores/auth.store";
import { useProjectStore } from "../../../stores/project.store";
import { Button } from "../../../components/Button";
import { EmptyState } from "../../../components/EmptyState";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectFormModal } from "../components/ProjectFormModal";
import type { Project } from "../../../types/project.types";
import type { ProjectFormValues } from "../schemas/project.schema";

function DashboardPage() {
  const { user, logout } = useAuthStore();
  const { projects, isLoading, fetchProjects, createProject, updateProject, deleteProject } =
    useProjectStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  useEffect(() => {
    if (user) fetchProjects(user.id);
  }, [user, fetchProjects]);

  const openCreateForm = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: ProjectFormValues) => {
    if (!user) return;
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      createProject(user.id, data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingProject) {
      deleteProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-background) p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-(--color-text)">Dashboard</h1>
          {user && (
            <p className="text-sm text-(--color-text-muted)">
              Logged in as {user.name} ({user.email})
            </p>
          )}
        </div>

        <Button variant="secondary" onClick={logout}>
          Log out
        </Button>
      </header>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-(--color-text)">Your projects</h2>
        <Button onClick={openCreateForm}>New project</Button>
      </div>

      {!isLoading && projects.length === 0 && (
        <EmptyState
          title="No Projects Yet"
          description="Create your first project to start organizing tasks."
          action={<Button onClick={openCreateForm}>New project</Button>}
        />
      )}

      {projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEditForm}
              onDelete={setDeletingProject}
            />
          ))}
        </div>
      )}

      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialProject={editingProject}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingProject)}
        title="Delete project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? All of its tasks will be deleted too. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProject(null)}
      />
    </div>
  );
}

export default DashboardPage;