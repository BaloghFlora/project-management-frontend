export interface CollectionResponseDTO<Type> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  elements: Type[];
}
