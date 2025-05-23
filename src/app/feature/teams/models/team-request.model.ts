
// feature/teams/models/team-request.model.ts
import { TeamBase } from './team-base.model';

export interface TeamRequest extends TeamBase {
  teamName: string;
  description : string;
}
