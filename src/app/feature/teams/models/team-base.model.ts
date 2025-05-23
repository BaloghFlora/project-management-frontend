
// feature/teams/models/team-base.model.ts
import {UUID} from 'crypto';

export interface TeamBase {
  id: string;
  teamName: string;
  description: string;
}
