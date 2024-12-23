export type Id = number | string;

export interface User {
  id: Id;
  name: string;
  email: string;
  phone: string;
  status: number;
}

export interface UserFilerType {
  items_per_page?: number;
  page?: number;
  search?: string;
}

export interface UserPaginationResponseType {
  data: User[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}
