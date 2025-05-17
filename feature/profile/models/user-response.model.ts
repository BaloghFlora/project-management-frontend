import { Role } from './user-role.enum';


export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: Role;
  cnp: string;
  birthDate: string;
  rating: number;
}
