// src/stores/project.store.ts

import { create } from "zustand";
import type { Project, CreateProjectData, UpdateProjectData } from "../types/project.types";
import { projectService } from "../services/project.service";
import { taskService } from "../services/task.service";
import { useToastStore } from "./toast.store";
import i18n from "../i18n/config";

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  fetchProjects: (ownerId: string) => void;
  createProject: (ownerId: string, data: CreateProjectData) => void;
  updateProject: (id: string, data: UpdateProjectData) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,

  fetchProjects: (ownerId) => {
    set({ isLoading: true });
    const projects = projectService.getByOwner(ownerId);
    set({ projects, isLoading: false });
  },

  createProject: (ownerId, data) => {
    const newProject = projectService.create(ownerId, data);
    set((state) => ({ projects: [...state.projects, newProject] }));
    useToastStore.getState().showToast(i18n.t("toast.projectCreated"), "success");
  },

  updateProject: (id, data) => {
    const updated = projectService.update(id, data);
    set((state) => ({ projects: state.projects.map((p) => (p.id === id ? updated : p)) }));
    useToastStore.getState().showToast(i18n.t("toast.projectUpdated"), "success");
  },

  deleteProject: (id) => {
    projectService.delete(id);
    taskService.deleteByProject(id);
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
    useToastStore.getState().showToast(i18n.t("toast.projectDeleted"), "success");
  },
}));

