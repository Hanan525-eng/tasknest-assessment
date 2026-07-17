import { create } from "zustand";
import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskStatus,
} from "../types/task.types";
import { taskService } from "../services/task.service";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;

  fetchTasks: (projectId: string) => void;
  createTask: (projectId: string, data: CreateTaskData) => void;
  updateTask: (id: string, data: UpdateTaskData) => void;
  deleteTask: (id: string) => void;
  /**
   * Convenience action for the quick status-change dropdown, so callers
   * don't need to build a full UpdateTaskData object just to flip status.
   */
  updateTaskStatus: (id: string, status: TaskStatus) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: (projectId) => {
    set({ isLoading: true });
    const tasks = taskService.getByProject(projectId);
    set({ tasks, isLoading: false });
  },

  createTask: (projectId, data) => {
    const newTask = taskService.create(projectId, data);
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTask: (id, data) => {
    const updated = taskService.update(id, data);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },

  deleteTask: (id) => {
    taskService.delete(id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },

  updateTaskStatus: (id, status) => {
    const updated = taskService.update(id, { status });
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  },
}));