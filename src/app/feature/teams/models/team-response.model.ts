// feature/teams/models/team-response.model.ts
import { TeamBase } from './team-base.model';

export interface TeamResponse extends TeamBase {
  teamName: string;
  description : string;
}
