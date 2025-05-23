// src/app/feature/tasks/models/task-request.model.ts
import {TaskBase} from './task-base.model';

export interface TaskRequest extends TaskBase {
  taskName: string;
  description: string;
  status: string;
  projectId?: number;
  assignedUserId?: number;
}
