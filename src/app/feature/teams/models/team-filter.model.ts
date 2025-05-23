// feature/teams/models/team-filter.model.ts
import { FilterRequest } from '../../../shared/models/filter-request-dto.model';

export interface TeamFilter extends FilterRequest {
  id?: string;
  teamName?: string;
  description?: string;
}
