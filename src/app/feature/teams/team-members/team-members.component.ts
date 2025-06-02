// feature/teams/team-members/team-members.component.ts - FIXED VERSION
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core'; // Added OnDestroy
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs'; // Added take operator
import { TeamService } from '../../../core/services/team/team.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TeamMember } from '../models/team-member.model';
import { TeamResponse } from '../models/team-response.model';
import { ModalType } from '../../../shared/models/modal-type.enum';
import { Role } from '../../profile/models/user-role.enum';
import { UserResponse } from '../../profile/models/user-response.model';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-members.component.html',
  styleUrl: './team-members.component.scss'
})
export class TeamMembersComponent implements OnInit, OnDestroy {
  teamId!: number;
  team?: TeamResponse;
  members: TeamMember[] = [];
  availableUsers: TeamMember[] = [];
  currentUser?: UserResponse;
  userSubscription?: Subscription;

  isLoading = false;
  isLoadingAvailableUsers = false;
  showAddMemberModal = false;
  currentPage = 0;
  totalPages = 0;
  availableUsersPage = 0;
  availableUsersTotalPages = 0;

  protected readonly Role = Role;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    private modalService: ModalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('=== TEAM MEMBERS COMPONENT INIT ===');

    const teamIdParam = this.route.snapshot.paramMap.get('id');
    console.log('Route param ID:', teamIdParam);

    if (teamIdParam && teamIdParam !== null) {
      this.teamId = +teamIdParam;
      console.log('Team ID:', this.teamId);

      // Check user permissions first
      this.authService.user$.pipe(take(1)).subscribe(user => {
        console.log('Current user:', user);
        console.log('User role:', user?.role);
        console.log('Has admin permission:', user?.role === Role.ADMIN);
        console.log('Has PM permission:', user?.role === Role.PROJECT_MANAGER);

        if (this.hasTeamPermission(user?.role)) {
          console.log('✅ User has permission, loading data...');
          this.loadTeam();
          this.loadTeamMembers();
        } else {
          console.error('❌ User lacks permission');
          this.modalService.open('Access Denied', 'You do not have permission to view team members.', ModalType.ERROR);
          this.router.navigate(['/teams']);
        }
      });

      this.watchCurrentUser();
    } else {
      console.error('Invalid team ID:', teamIdParam);
      this.modalService.open('Error', 'Invalid team ID', ModalType.ERROR);
      this.router.navigate(['/teams']);
    }
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  private hasTeamPermission(role?: Role): boolean {
    return role === Role.ADMIN || role === Role.PROJECT_MANAGER;
  }

  private watchCurrentUser(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.currentUser = user;
      console.log('User updated:', user?.name, 'Role:', user?.role);
    });
  }

  private loadTeam(): void {
    console.log('Loading team details for ID:', this.teamId);
    this.teamService.getById(this.teamId.toString()).subscribe({
      next: (team) => {
        this.team = team;
        console.log('✅ Team loaded:', team.teamName);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Failed to load team:', error);
        this.modalService.open('Error', `Failed to load team details: ${error.message}`, ModalType.ERROR);
      }
    });
  }

  private loadTeamMembers(): void {
    console.log('Loading team members for team ID:', this.teamId);
    this.isLoading = true;

    this.teamService.getTeamMembers(this.teamId, this.currentPage).subscribe({
      next: (response) => {
        console.log('✅ Team members loaded:', response);
        this.members = response.elements;
        this.totalPages = response.totalPages;
        this.isLoading = false;
        console.log(`Found ${response.totalElements} total members, ${response.elements.length} on this page`);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Failed to load team members:', error);
        console.error('Status:', error.status);
        console.error('Error details:', error.error);

        this.isLoading = false;

        let errorMessage = 'Failed to load team members';
        if (error.status === 403) {
          errorMessage = 'You do not have permission to view team members';
        } else if (error.status === 404) {
          errorMessage = 'Team not found';
        } else if (error.status === 500) {
          errorMessage = 'Server error - please contact administrator';
        }

        this.modalService.open('Error', errorMessage, ModalType.ERROR);
      }
    });
  }

  private loadAvailableUsers(): void {
    console.log('Loading available users...');
    this.isLoadingAvailableUsers = true;

    this.teamService.getAvailableUsers(this.availableUsersPage).subscribe({
      next: (response) => {
        console.log('✅ Available users loaded:', response);
        this.availableUsers = response.elements;
        this.availableUsersTotalPages = response.totalPages;
        this.isLoadingAvailableUsers = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Failed to load available users:', error);
        this.isLoadingAvailableUsers = false;
        this.modalService.open('Error', 'Failed to load available users', ModalType.ERROR);
      }
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.role === Role.ADMIN;
  }

  openAddMemberModal(): void {
    console.log('Opening add member modal...');
    this.showAddMemberModal = true;
    this.loadAvailableUsers();
  }

  closeAddMemberModal(): void {
    console.log('Closing add member modal...');
    this.showAddMemberModal = false;
    this.availableUsers = [];
  }

  addMember(userId: number): void {
    console.log('Adding member:', userId, 'to team:', this.teamId);

    this.teamService.addTeamMember(this.teamId, { userId }).subscribe({
      next: (member) => {
        console.log('✅ Member added successfully:', member);
        this.members.push(member);
        this.availableUsers = this.availableUsers.filter(u => u.id !== userId);
        this.modalService.open('Success', 'Team member added successfully!', ModalType.SUCCESS);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Failed to add member:', error);
        this.modalService.open('Error', error.error?.message || 'Failed to add team member', ModalType.ERROR);
      }
    });
  }

  removeMember(member: TeamMember): void {
    console.log('Requesting to remove member:', member.name);

    this.modalService.open(
      'Remove Member',
      `Are you sure you want to remove ${member.name} from this team?`,
      ModalType.CONFIRM
    );

    this.modalService.confirm$.pipe(take(1)).subscribe(() => {
      console.log('Confirmed removal of member:', member.id);

      this.teamService.removeTeamMember(this.teamId, member.id).subscribe({
        next: () => {
          console.log('✅ Member removed successfully');
          this.members = this.members.filter(m => m.id !== member.id);
          this.modalService.open('Success', 'Team member removed successfully!', ModalType.SUCCESS);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Failed to remove member:', error);
          this.modalService.open('Error', error.error?.message || 'Failed to remove team member', ModalType.ERROR);
        }
      });
    });
  }

  onPageChange(page: number): void {
    console.log('Changing to page:', page);
    this.currentPage = page;
    this.loadTeamMembers();
  }

  onAvailableUsersPageChange(page: number): void {
    console.log('Changing available users to page:', page);
    this.availableUsersPage = page;
    this.loadAvailableUsers();
  }

  getPageNumbers(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  goBack(): void {
    console.log('Navigating back to teams list');
    this.router.navigate(['/teams']);
  }


}
