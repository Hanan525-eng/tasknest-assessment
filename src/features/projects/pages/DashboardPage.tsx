// // src/features/projects/pages/DashboardPage.tsx

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FolderOpen, Search } from "lucide-react";
import { useAuthStore } from "../../../stores/auth.store";
import { useProjectStore } from "../../../stores/project.store";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { EmptyState } from "../../../components/EmptyState";
import { CardSkeleton } from "../../../components/Skeleton";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectFormModal } from "../components/ProjectFormModal";
import type { Project } from "../../../types/project.types";
import type { ProjectFormValues } from "../schemas/project.schema";

function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { projects, isLoading, fetchProjects, createProject, updateProject, deleteProject } =
    useProjectStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  useEffect(() => {
    if (user) fetchProjects(user.id);
  }, [user, fetchProjects]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(query));
  }, [projects, searchQuery]);

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
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-(--color-text)">
          {t("dashboard.yourProjects")}
        </h2>
        <Button onClick={openCreateForm}>{t("dashboard.newProject")}</Button>
      </div>

      {projects.length > 0 && (
        <div className="relative mb-4 max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-(--color-text-muted)"
          />
          <Input
            label={t("dashboard.searchPlaceholder")}
            hideLabel
            placeholder={t("dashboard.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-9"
          />
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <EmptyState
          icon={<FolderOpen size={24} />}
          title={t("dashboard.emptyTitle")}
          description={t("dashboard.emptyDescription")}
          action={<Button onClick={openCreateForm}>{t("dashboard.newProject")}</Button>}
        />
      )}

      {!isLoading && projects.length > 0 && filteredProjects.length === 0 && (
        <EmptyState icon={<Search size={24} />} title={t("dashboard.noResults")} />
      )}

      {filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
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
        title={t("project.delete.title")}
        message={t("project.delete.message", { name: deletingProject?.name ?? "" })}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProject(null)}
      />
    </div>
  );
}

export default DashboardPage;

