// src/services/project.service.ts

import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
} from "../types/project.types";

const PROJECTS_KEY = "tasknest_projects";

function getAllStored(): Project[] {
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

function saveAll(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function generateId(): string {
  return crypto.randomUUID();
}

export const projectService = {
  getByOwner(ownerId: string): Project[] {
    return getAllStored().filter((p) => p.ownerId === ownerId);
  },

  getById(id: string): Project | null {
    return getAllStored().find((p) => p.id === id) ?? null;
  },

  create(ownerId: string, data: CreateProjectData): Project {
    const projects = getAllStored();

    const newProject: Project = {
      id: generateId(),
      ownerId,
      name: data.name,
      description: data.description,
      color: data.color,
      createdAt: new Date().toISOString(),
    };

    saveAll([...projects, newProject]);
    return newProject;
  },

  update(id: string, data: UpdateProjectData): Project {
    const projects = getAllStored();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error("PROJECT_NOT_FOUND");
    }

    const updated: Project = { ...projects[index], ...data };
    projects[index] = updated;
    saveAll(projects);

    return updated;
  },

  delete(id: string): void {
    const projects = getAllStored().filter((p) => p.id !== id);
    saveAll(projects);
  },
};