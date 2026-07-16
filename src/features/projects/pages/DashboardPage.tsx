// src/features/projects/pages/DashboardPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClipboard, FiFolder } from "react-icons/fi";
import { useAuthStore } from "../../../stores/auth.store";
import { useProjectStore } from "../../../stores/project.store";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { Toast } from "../../../components/Toast";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectModal } from "../components/ProjectModal";
import type { Project } from "../../../types/project.types";
import type { ProjectFormValues } from "../schemas/project.schema";

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { projects, isLoading, loadProjects, createProject, updateProject, deleteProject } =
    useProjectStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const handleCreateProject = (data: ProjectFormValues) => {
    setIsSubmitting(true);
    const result = createProject({ ...data, description: data.description ?? "", color: data.color ?? "" });
    setIsSubmitting(false);
    if (result) {
      setIsModalOpen(false);
      showToast("success", `Project "${result.name}" created successfully!`);
    } else {
      showToast("error", "Failed to create project.");
    }
  };

  const handleUpdateProject = (data: ProjectFormValues) => {
    if (!editingProject) return;
    setIsSubmitting(true);
    const result = updateProject(editingProject.id, data);
    setIsSubmitting(false);
    if (result) {
      setIsModalOpen(false);
      setEditingProject(null);
      showToast("success", `Project "${result.name}" updated successfully!`);
    } else {
      showToast("error", "Failed to update project.");
    }
  };

  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    const deleted = deleteProject(projectToDelete.id);
    if (deleted) {
      showToast("success", `Project "${projectToDelete.name}" deleted successfully.`);
    } else {
      showToast("error", "Failed to delete project.");
    }
    setProjectToDelete(null);
  };

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-[var(--color-text)]">
              <FiClipboard aria-hidden="true" /> Dashboard
            </h1>
            {user && (
              <p className="text-sm text-[var(--color-text-muted)]">Welcome back, {user.name}!</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsModalOpen(true)}>+ New Project</Button>
            <Button variant="secondary" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {isLoading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-border)]"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] py-16">
            <FiFolder size={56} className="text-[var(--color-text-muted)]" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-[var(--color-text)]">No Projects Yet</h2>
            <p className="mt-2 text-[var(--color-text-muted)]">Create your first project to get started.</p>
            <Button className="mt-6" onClick={() => setIsModalOpen(true)}>
              + Create Your First Project
            </Button>
          </div>
        ) : (
          // Projects Grid
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={(p) => {
                  setEditingProject(p);
                  setIsModalOpen(true);
                }}
                onDelete={(p) => setProjectToDelete(p)}
                onClick={handleProjectClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        initialData={editingProject}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <Modal
          isOpen={Boolean(projectToDelete)}
          onClose={() => setProjectToDelete(null)}
          title="Delete Project?"
          size="sm"
        >
          <p className="text-sm text-[var(--color-text-muted)]">
            Are you sure you want to delete "{projectToDelete.name}"? This will also
            delete all tasks associated with this project. This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setProjectToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteProject}>
              Delete
            </Button>
          </div>
        </Modal>
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default DashboardPage;
