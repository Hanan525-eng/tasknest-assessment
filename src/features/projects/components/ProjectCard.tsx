// src/features/projects/components/ProjectCard.tsx

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Project } from "../../../types/project.types";
import { Button } from "../../../components/Button";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete, onClick }: ProjectCardProps) {
  return (
    <div
      className="group cursor-pointer rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)]"
      onClick={() => onClick(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(project);
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 flex-shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <div>
            <h3 className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-[var(--color-text-muted)] line-clamp-1">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Edit ${project.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
          >
            <FiEdit2 size={16} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Delete ${project.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
          >
            <FiTrash2 size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}