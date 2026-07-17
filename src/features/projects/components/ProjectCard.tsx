// src/features/projects/components/ProjectCard.tsx

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import type { Project } from "../../../types/project.types";

export interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card
      interactive
      onClick={() => navigate(`/projects/${project.id}`)}
      className="flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
            aria-hidden="true"
          />
          <h3 className="font-semibold text-(--color-text)">{project.name}</h3>
        </div>
      </div>

      {project.description && (
        <p className="line-clamp-2 text-sm text-(--color-text-muted)">
          {project.description}
        </p>
      )}

      <div
        className="mt-2 flex justify-end gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(project)}>
          {t("common.edit")}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(project)}>
          {t("common.delete")}
        </Button>
      </div>
    </Card>
  );
}

