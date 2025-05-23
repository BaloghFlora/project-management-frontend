import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ROUTES } from '../../../core/config/routes.enum';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { TeamService } from '../../../core/services/team/team.service';
import { ModalType } from '../../../shared/models/modal-type.enum';
import { UserResponse } from '../../profile/models/user-response.model';
import { Role } from '../../profile/models/user-role.enum';
import { TeamResponse } from '../models/team-response.model';
import { TeamRequest } from '../models/team-request.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent implements OnInit, OnDestroy {
  teamId!: string;
  teamForm!: FormGroup;
  editMode = false;
  loading = false;
  originalTeamData?: TeamResponse;
  subject$ = new Subject<void>();
  userSubscription?: Subscription;
  loggedUser?: UserResponse;

  // Data for tasks component
  availableProjects: any[] = []; // You can populate this with actual project data
  teamMembers: any[] = []; // You can populate this with actual team member data

  // Expose Role enum to template
  protected readonly Role = Role;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private teamService: TeamService,
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.fetchTeamId();
    this.fetchTeam();
    this.watchTeamDeletion();
    this.watchUser();
  }

  ngOnDestroy(): void {
    this.subject$.next();
    this.subject$.complete();
    this.userSubscription?.unsubscribe();
  }

  private fetchTeamId(): void {
    this.teamId = this.route.snapshot.paramMap.get('id')!;
  }

  private fetchTeam(): void {
    if (!this.teamId) {
      this.router.navigate(['/teams']);
      return;
    }

    this.loading = true;
    this.teamService.getById(this.teamId).subscribe({
      next: (team) => {
        this.originalTeamData = team;
        this.buildForm(team);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Failed to load team details';
        this.modalService.open('Error', errorMessage, ModalType.ERROR);
        console.error('Error loading team:', error);
      }
    });
  }

  private buildForm(team: TeamResponse): void {
    this.teamForm = this.fb.group({
      id: [
        { value: team.id, disabled: true }
      ],
      teamName: [
        { value: team.teamName, disabled: true },
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],
      description: [
        { value: team.description || '', disabled: true },
        [
          Validators.maxLength(255)
        ]
      ]
    });
  }

  private watchUser(): void {
    this.userSubscription = this.authService.user$
      .subscribe(response => this.loggedUser = response);
  }

  enableEditMode(): void {
    this.editMode = true;
    this.teamForm.get('teamName')?.enable();
    this.teamForm.get('description')?.enable();
  }

  cancelEdit(): void {
    this.editMode = false;
    if (this.originalTeamData) {
      this.buildForm(this.originalTeamData);
    }
  }

  saveChanges(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const updatedTeam: TeamRequest = {
      id: this.teamForm.get('id')?.value,
      teamName: this.teamForm.get('teamName')?.value,
      description: this.teamForm.get('description')?.value || ''
    };

    this.teamService.update(this.teamId, updatedTeam).subscribe({
      next: (updatedTeamResponse) => {
        this.originalTeamData = updatedTeamResponse;
        this.editMode = false;
        this.teamForm.get('teamName')?.disable();
        this.teamForm.get('description')?.disable();
        this.loading = false;
        this.modalService.open('Success', 'Team has been successfully updated!', ModalType.SUCCESS);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Failed to update team';
        this.modalService.open('Error', errorMessage, ModalType.ERROR);
        console.error('Error updating team:', error);
      }
    });
  }

  deleteTeam(): void {
    const teamName = this.teamForm.get('teamName')?.value;
    this.modalService.open(
      'Delete Team',
      `Are you sure you want to delete the team "${teamName}"? This action cannot be undone.`,
      ModalType.CONFIRM
    );
  }

  private watchTeamDeletion(): void {
    this.modalService.confirm$
      .pipe(takeUntil(this.subject$))
      .subscribe(() => {
        this.performDelete();
      });
  }

  private performDelete(): void {
    this.loading = true;
    this.teamService.delete(this.teamId).subscribe({
      next: () => {
        this.modalService.open('Deleted', 'Team has been successfully deleted.', ModalType.SUCCESS);
        // Navigate back to teams list after a short delay
        setTimeout(() => {
          this.router.navigate(['/teams']);
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const errorMessage = error.error?.message || 'Failed to delete team';
        this.modalService.open('Error', errorMessage, ModalType.ERROR);
        console.error('Error deleting team:', error);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  // Permission checks
  canEditTeam(): boolean {
    return this.loggedUser?.role === Role.ADMIN ||
      this.loggedUser?.role === Role.PROJECT_MANAGER;
  }

  canDeleteTeam(): boolean {
    return this.loggedUser?.role === Role.ADMIN;
  }
}
