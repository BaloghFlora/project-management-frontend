import { FilterRequest } from '../../../shared/models/filter-request-dto.model';


export interface TeamFilter extends FilterRequest {
  name?: string;
  rating?: number;
  cnp?: number;
  birthDate?: string;
}
