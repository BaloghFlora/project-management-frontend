// src/app/feature/tasks/models/task-base.model.ts
export interface TaskBase {
  taskName: string;
  description: string;
  status: string;
  projectId?: number;
  assignedUserId?: number;
}
