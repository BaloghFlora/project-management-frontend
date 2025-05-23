import { FilterRequest } from '../../../shared/models/filter-request-dto.model';

export interface TaskFilter extends FilterRequest {
  taskName?: string;
  status?: string;
  projectId?: number;
  assignedUserId?: number;
}
