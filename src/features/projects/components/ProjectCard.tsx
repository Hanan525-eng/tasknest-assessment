// src/features/projects/components/ProjectCard.tsx

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
      className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
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
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
          >
            ✏️
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
          >
            🗑️
          </Button>
        </div>
      </div>
    </div>
  );
}