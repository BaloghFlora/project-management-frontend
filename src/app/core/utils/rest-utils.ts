import { HttpParams } from '@angular/common/http';
import { TeamFilter } from '../../feature/teams/models/team-filter.model';
import { apiConfig } from '../config/api-config';

/**
 * Builds a TeamFilter DTO from search string and page number
 * @param searchBy Search string
 * @param page Page number
 * @returns TeamFilter object
 */
export const buildTeamFilterDTOFromSearchBy = (searchBy: string | null, page: number):
  TeamFilter => {
  if (!searchBy) {
    return {
      pageNumber: page,
      pageSize: apiConfig.pageSize
    };
  }

  const isNumeric = !isNaN(Number(searchBy));
  const isBoolean = searchBy === 'true' || searchBy === 'false';
  const isDateLike = /^\d{4}-\d{2}-\d{2}(T.*)?(Z|[+-]\d{2}:\d{2})?$/.test(searchBy);

  return {
    teamName: searchBy,
    description: searchBy,
    pageNumber: page,
    pageSize: apiConfig.pageSize
  };
};


  export const buildTeamQueryParams = (filter?: TeamFilter): HttpParams => {
    return Object.entries(filter || {})
      .reduce((params, [key, value]) => value != null && value !== '' ? params.set(key, String(value)) : params,
        new HttpParams()
      );
  };
