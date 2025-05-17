import { HttpParams } from '@angular/common/http';
import { TeamFilter } from '../../feature/teams/models/chef-filter.model';
import { apiConfig } from '../config/api-config';


export const buildChefFilterDTOFromSearchBy = (searchBy: string | null, page: number): TeamFilter => {
  if (!searchBy) {
    return {
      pageNumber: page,
      pageSize: apiConfig.pageSize
    };
  }

  const numValue = Number(searchBy);
  const isNumeric = !isNaN(numValue);
  const isDateLike = /^\d{4}-\d{2}-\d{2}(T.*)?(Z|[+-]\d{2}:\d{2})?$/.test(searchBy);

  return {
    name: searchBy,
    rating: isNumeric ? numValue : undefined,
    cnp: isNumeric ? numValue : undefined,
    birthDate: isDateLike ? searchBy : undefined,
    pageNumber: page,
    pageSize: apiConfig.pageSize
  };
};

export const buildChefQueryParams = (filter?: TeamFilter): HttpParams => {
  return Object.entries(filter || {})
    .reduce((params, [ key, value ]) => value != null && value !== '' ? params.set(key, String(value)) : params,
      new HttpParams()
    );
};
