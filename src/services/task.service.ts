// src/services/task.service.ts

import type { Task, CreateTaskData, UpdateTaskData } from "../types/task.types";

const TASKS_KEY = "tasknest_tasks";

function getAllStored(): Task[] {
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function saveAll(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function generateId(): string {
  return crypto.randomUUID();
}

export const taskService = {
  getByProject(projectId: string): Task[] {
    return getAllStored().filter((t) => t.projectId === projectId);
  },

  create(projectId: string, data: CreateTaskData): Task {
    const tasks = getAllStored();

    const newTask: Task = {
      id: generateId(),
      projectId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
    };

    saveAll([...tasks, newTask]);
    return newTask;
  },

  update(id: string, data: UpdateTaskData): Task {
    const tasks = getAllStored();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("TASK_NOT_FOUND");
    }

    const updated: Task = { ...tasks[index], ...data };
    tasks[index] = updated;
    saveAll(tasks);

    return updated;
  },

  delete(id: string): void {
    const tasks = getAllStored().filter((t) => t.id !== id);
    saveAll(tasks);
  },

  /**
   * Cascading delete used when a project is removed.
   */
  deleteByProject(projectId: string): void {
    const tasks = getAllStored().filter((t) => t.projectId !== projectId);
    saveAll(tasks);
  },
};