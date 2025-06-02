import {Role} from '../../profile/models/user-role.enum';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: Role;
  teamId?: number;
  teamName?: string;
}
