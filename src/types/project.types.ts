// src/types/project.types.ts

export interface Project {
  id: string;

  // Display name shown in the dashboard
  name: string;

  description: string;

  // Accent color used for the project card
  color: string;

  createdAt: string;
  updatedAt: string;
}

export type CreateProjectData = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type UpdateProjectData = Partial<CreateProjectData>;