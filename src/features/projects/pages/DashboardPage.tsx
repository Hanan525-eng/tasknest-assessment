// src/features/projects/pages/DashboardPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth.store";
import { useProjectStore } from "../../../stores/project.store";
import { Button } from "../../../components/Button";
import { Toast } from "../../../components/Toast";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectModal } from "../components/ProjectModal";
import type { Project } from "../../../types/project.types";

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
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateProject = async (data: any) => {
    setIsSubmitting(true);
    const result = createProject(data);
    setIsSubmitting(false);
    if (result) {
      setIsModalOpen(false);
      showToast("success", `Project "${result.name}" created successfully!`);
    } else {
      showToast("error", "Failed to create project.");
    }
  };

  const handleUpdateProject = async (data: any) => {
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
    // Will navigate to project details later
    console.log("Navigate to project:", project.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📋 Dashboard</h1>
            {user && (
              <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
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
                className="h-24 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16">
            <div className="text-6xl">📂</div>
            <h2 className="mt-4 text-xl font-semibold text-gray-700">No Projects Yet</h2>
            <p className="mt-2 text-gray-500">Create your first project to get started.</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete Project?</h3>
            <p className="mt-2 text-sm text-gray-500">
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
          </div>
        </div>
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



// //  src/features/projects/pages/DashboardPage.tsx

// import { useAuthStore } from "../../../stores/auth.store";
// import { Button } from "../../../components/Button";

// /**
//  * DashboardPage
//  * -----------------------------------------------------------------------
//  * Temporary shell: just proves the protected route + logout flow works
//  * end-to-end. The real Projects list/CRUD UI replaces this content in
//  * the next step (feature/projects-crud).
//  * -----------------------------------------------------------------------
//  */

// function DashboardPage() {
//   const { user, logout } = useAuthStore();

//   return (
//     <div className="min-h-screen bg-(--color-background) p-8">
//       <header className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-(--color-text)">
//             Dashboard
//           </h1>
//           {user && (
//             <p className="text-sm text-(--color-text-muted)">
//               Logged in as {user.name} ({user.email})
//             </p>
//           )}
//         </div>

//         <Button variant="secondary" onClick={logout}>
//           Log out
//         </Button>
//       </header>

//       <p className="text-sm text-(--color-text-muted)">
//         Projects will appear here.
//       </p>
//     </div>
//   );
// }

// export default DashboardPage;