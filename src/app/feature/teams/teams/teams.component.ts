// feature/teams/teams/teams.component.ts
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TeamService } from '../../../core/services/team/team.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { buildTeamFilterDTOFromSearchBy } from '../../../core/utils/rest-utils';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ModalType } from '../../../shared/models/modal-type.enum';
import { TeamResponse } from '../models/team-response.model';
import { UserResponse } from '../../profile/models/user-response.model';
import { Role } from '../../profile/models/user-role.enum';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    SearchBarComponent,
    PaginationComponent
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit, OnDestroy {

  teams: TeamResponse[] = [];
  loading = false;
  error: string | null = null;
  addTeamForm!: FormGroup;
  showAddForm = false;
  currentPage = 0;
  totalPages = 0;
  currentUser?: UserResponse;
  userSubscription?: Subscription;

  constructor(
    private teamService: TeamService,
    private authService: AuthService,
    private modalService: ModalService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildTeamForm();
    this.watchCurrentUser();
    this.subscribeToRouteParams();
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  private subscribeToRouteParams(): void {
    this.route.queryParamMap.subscribe(params => {
      const searchBy = params.get('searchBy') ?? '';
      this.currentPage = +(params.get('page') ?? '0');
      this.fetchTeams(searchBy, this.currentPage);
    });
  }

  private watchCurrentUser(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  private buildTeamForm(): void {
    this.addTeamForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(255)]]
    });
  }

  private fetchTeams(searchBy: string, page: number): void {
    this.loading = true;
    this.error = null;

    const filter = buildTeamFilterDTOFromSearchBy(searchBy, page);

    this.teamService.getAll(filter).subscribe({
      next: (response) => {
        this.teams = response.elements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Failed to load teams';
        this.loading = false;
        console.error('Error loading teams:', error);
      }
    });
  }

  // Permission checks
  canCreateTeam(): boolean {
    return this.currentUser?.role === Role.ADMIN;
  }

  canEditTeam(): boolean {
    return this.currentUser?.role === Role.ADMIN || this.currentUser?.role === Role.PROJECT_MANAGER;
  }

  canDeleteTeam(): boolean {
    return this.currentUser?.role === Role.ADMIN;
  }

  // Form actions
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.addTeamForm.reset();
    }
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.addTeamForm.reset();
  }

  saveTeam(): void {
    if (this.addTeamForm.invalid) {
      this.addTeamForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const newTeam = { ...this.addTeamForm.value };

    this.teamService.save(newTeam).subscribe({
      next: (savedTeam) => {
        this.teams.unshift(savedTeam); // Add to beginning of list
        this.addTeamForm.reset();
        this.showAddForm = false;
        this.loading = false;
        this.modalService.open('Success', 'Team has been successfully created!', ModalType.SUCCESS);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Failed to create team';
        this.modalService.open('Error', errorMessage, ModalType.ERROR);
      }
    });
  }

  // Team actions
  editTeam(team: TeamResponse): void {
    // This could open a modal or navigate to edit page
    console.log('Edit team:', team);
    // For now, just show a message
    this.modalService.open('Info', `Edit functionality for "${team.teamName}" will be implemented soon.`, ModalType.INFO);
  }

  confirmDeleteTeam(team: TeamResponse): void {
    this.modalService.open(
      'Delete Team',
      `Are you sure you want to delete "${team.teamName}"? This action cannot be undone and will remove all team members from this team.`,
      ModalType.CONFIRM
    );

    this.modalService.confirm$.subscribe(() => {
      this.deleteTeam(team);
    });
  }

  private deleteTeam(team: TeamResponse): void {
    this.teamService.delete(team.id.toString()).subscribe({
      next: () => {
        this.teams = this.teams.filter(t => t.id !== team.id);
        this.modalService.open('Success', 'Team has been deleted successfully!', ModalType.SUCCESS);
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || 'Failed to delete team';
        this.modalService.open('Error', errorMessage, ModalType.ERROR);
      }
    });
  }

  // Utility actions
  refreshTeams(): void {
    const currentSearchBy = this.route.snapshot.queryParamMap.get('searchBy') ?? '';
    this.fetchTeams(currentSearchBy, this.currentPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    const currentSearchBy = this.route.snapshot.queryParamMap.get('searchBy') ?? '';
    this.fetchTeams(currentSearchBy, page);
  }
}

