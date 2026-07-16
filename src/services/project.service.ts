// src/services/project.service.ts

import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
} from "../types/project.types";

/**
 * project.service.ts
 * -----------------------------------------------------------------------
 * Handles all Project CRUD operations using localStorage.
 *
 * The rest of the application never talks directly to localStorage.
 * If the application later moves to a real backend, only this file
 * needs to change.
 * -----------------------------------------------------------------------
 */

const PROJECTS_KEY = "tasknest_projects";

/**
 * Default project colors.
 * Each new project gets the first unused color.
 */
const PROJECT_COLORS = [
  "#2563eb", // Blue
  "#7c3aed", // Purple
  "#dc2626", // Red
  "#16a34a", // Green
  "#d97706", // Amber
  "#db2777", // Pink
  "#0891b2", // Cyan
];

interface ProjectService {
  getAll(): Project[];
  getById(id: string): Project | null;
  create(data: CreateProjectData): Project;
  update(id: string, data: UpdateProjectData): Project | null;
  delete(id: string): boolean;
}

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

function getStoredProjects(): Project[] {
  const raw = localStorage.getItem(PROJECTS_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

function saveStoredProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function generateId(): string {
  return crypto.randomUUID();
}

function getDefaultColor(projects: Project[]): string {
  const usedColors = projects.map((project) => project.color);

  const availableColor = PROJECT_COLORS.find(
    (color) => !usedColors.includes(color)
  );

  return (
    availableColor ??
    PROJECT_COLORS[projects.length % PROJECT_COLORS.length]
  );
}

/* ------------------------------------------------------------------ */
/* Service */
/* ------------------------------------------------------------------ */

export const projectService: ProjectService = {
  getAll(): Project[] {
    return getStoredProjects();
  },

  getById(id: string): Project | null {
    const projects = getStoredProjects();

    return projects.find((project) => project.id === id) ?? null;
  },

  create(data: CreateProjectData): Project {
    const projects = getStoredProjects();

    const now = new Date().toISOString();

    const newProject: Project = {
      id: generateId(),
      ...data,
      color: data.color || getDefaultColor(projects),
      createdAt: now,
      updatedAt: now,
    };

    saveStoredProjects([...projects, newProject]);

    return newProject;
  },

  update(id: string, data: UpdateProjectData): Project | null {
    const projects = getStoredProjects();

    const existingProject = projects.find(
      (project) => project.id === id
    );

    if (!existingProject) {
      return null;
    }

    const updatedProject: Project = {
      ...existingProject,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = projects.map((project) =>
      project.id === id ? updatedProject : project
    );

    saveStoredProjects(updatedProjects);

    return updatedProject;
  },

  delete(id: string): boolean {
    const projects = getStoredProjects();

    const filteredProjects = projects.filter(
      (project) => project.id !== id
    );

    if (filteredProjects.length === projects.length) {
      return false;
    }

    saveStoredProjects(filteredProjects);

    return true;
  },
};