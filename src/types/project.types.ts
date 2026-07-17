// src/types/project.types.ts

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  color: string;
}

export type UpdateProjectData = Partial<CreateProjectData>;