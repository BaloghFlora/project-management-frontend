import { Role } from './user-role.enum';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
  teamId: number | null;
  teamName: string | null;
}
