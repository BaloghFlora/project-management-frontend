export interface TaskResponse {
  id: number;
  taskName: string;
  description: string;
  status: string;
  projectId?: number;
  projectName?: string;
  assignedUserId?: number;
  assignedUserName?: string;
}
