// src/app/core/services/task/task.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CollectionResponseDTO } from '../../../shared/models/collection-response-dto.model';

interface TaskRequest {
  taskName: string;
  description: string;
  status: string;
  projectId?: number;
  assignedUserId?: number;
}

interface TaskResponse {
  id: number;
  taskName: string;
  description: string;
  status: string;
  projectId?: number;
  projectName?: string;
  assignedUserId?: number;
  assignedUserName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  // Get all tasks (Admin/Project Manager only)
  getAll(page: number = 0, size: number = 10): Observable<CollectionResponseDTO<TaskResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<CollectionResponseDTO<TaskResponse>>('/v1/tasks', { params });
  }

  // Get tasks by project ID
  getByProjectId(projectId: number, page: number = 0, size: number = 10): Observable<CollectionResponseDTO<TaskResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<CollectionResponseDTO<TaskResponse>>(
      `/v1/tasks/project/${projectId}`,
      { params }
    );
  }

  // Get tasks by assigned user ID
  getByAssignedUserId(userId: number, page: number = 0, size: number = 10): Observable<CollectionResponseDTO<TaskResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<CollectionResponseDTO<TaskResponse>>(
      `/v1/tasks/user/${userId}`,
      { params }
    );
  }

  // Get task by ID
  getById(taskId: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`/v1/tasks/${taskId}`);
  }

  // Create new task
  save(task: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>('/v1/tasks', task);
  }

  // Update existing task
  update(taskId: number, task: TaskRequest): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`/v1/tasks/${taskId}`, task);
  }

  // Delete task
  delete(taskId: number): Observable<void> {
    return this.http.delete<void>(`/v1/tasks/${taskId}`);
  }
}
