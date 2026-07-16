// src/stores/project.store.ts

import { create } from "zustand";

import { projectService } from "../services/project.service";
import { taskService } from "../services/task.service";

import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
} from "../types/project.types";

type ProjectStatus = "idle" | "loading" | "success" | "error";

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  status: ProjectStatus;
  error: string | null;

  loadProjects: () => void;
  createProject: (data: CreateProjectData) => Project | null;
  updateProject: (id: string, data: UpdateProjectData) => Project | null;
  deleteProject: (id: string) => boolean;
  selectProject: (id: string) => void;
  getProjectById: (id: string) => Project | null;
  clearSelection: () => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  status: "idle",
  error: null,

  loadProjects: () => {
    set({ status: "loading", error: null });
    try {
      const projects = projectService.getAll();
      set({ projects, status: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
      set({ status: "error", error: message });
    }
  },

  createProject: (data) => {
    set({ status: "loading", error: null });
    try {
      const project = projectService.create(data);
      set((state) => ({
        projects: [...state.projects, project],
        status: "success",
      }));
      return project;
    } catch (err) {
      const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
      set({ status: "error", error: message });
      return null;
    }
  },

  updateProject: (id, data) => {
    set({ status: "loading", error: null });
    try {
      const updatedProject = projectService.update(id, data);

      if (!updatedProject) {
        throw new Error("PROJECT_NOT_FOUND");
      }

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? updatedProject : project
        ),
        selectedProject: updatedProject,
        status: "success",
      }));
      return updatedProject;
    } catch (err) {
      const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
      set({ status: "error", error: message });
      return null;
    }
  },

  deleteProject: (id) => {
    set({ status: "loading", error: null });
    try {
      const deleted = projectService.delete(id);

      if (!deleted) {
        throw new Error("PROJECT_NOT_FOUND");
      }

      // متطلب صريح في الـ PDF: حذف المشروع لازم يمسح الـ tasks بتاعته
      taskService.deleteByProjectId(id);

      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        selectedProject:
          state.selectedProject?.id === id ? null : state.selectedProject,
        status: "success",
      }));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
      set({ status: "error", error: message });
      return false;
    }
  },

  selectProject: (id) => {
    const project = get().projects.find((project) => project.id === id) ?? null;
    set({ selectedProject: project });
  },

  getProjectById: (id) => {
    return get().projects.find((project) => project.id === id) ?? null;
  },

  clearSelection: () => set({ selectedProject: null }),

  clearError: () => set({ error: null }),
}));