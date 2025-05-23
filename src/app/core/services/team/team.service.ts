import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamFilter } from '../../../feature/teams/models/team-filter.model';
import { TeamRequest } from '../../../feature/teams/models/team-request.model';
import { TeamResponse } from '../../../feature/teams/models/team-response.model';
import { CollectionResponseDTO } from '../../../shared/models/collection-response-dto.model';
import { ROUTES } from '../../config/routes.enum';
import {buildTeamQueryParams} from '../../utils/rest-utils';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  getAll(filter?: TeamFilter): Observable<CollectionResponseDTO<TeamResponse>> {
    return this.http.get<CollectionResponseDTO<TeamResponse>>(
      `/v1/${ROUTES.TEAMS}`,
      { params: buildTeamQueryParams(filter) }
    );
  }

  getById(teamId: string): Observable<TeamResponse> {
    return this.http.get<TeamResponse>(`/v1/${ROUTES.TEAMS}/${teamId}`);
  }

  save(team: TeamRequest): Observable<TeamResponse> {
    return this.http.post<TeamResponse>(`/v1/${ROUTES.TEAMS}`, team);
  }

  update(teamId: string, team: TeamRequest): Observable<TeamResponse> {
    return this.http.put<TeamResponse>(`/v1/${ROUTES.TEAMS}/${teamId}`, team);
  }

  delete(teamId: string): Observable<void> {
    return this.http.delete<void>(`/v1/${ROUTES.TEAMS}/${teamId}`);
  }
}
