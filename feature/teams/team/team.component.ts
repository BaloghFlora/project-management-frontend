import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ROUTES } from '../../../core/config/routes.enum';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { ModalType } from '../../../shared/models/modal-type.enum';
import { UserResponse } from '../../profile/models/user-response.model';
import { Role } from '../../profile/models/user-role.enum';
import {TeamService} from '../../../core/services/team/team.service';


@Component({
  selector: 'app-team',
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
  subject$ = new Subject<void>();
  userSubscription?: Subscription;
  loggedUser?: UserResponse;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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
    this.teamService.getById(this.teamId).subscribe((team => {
      this.teamForm = this.fb.group({
        id: [
          { value: team.id, disabled: true },
          [ Validators.required ]
        ],
        name: [
          { value: team.name, disabled: true },
          [ Validators.required ]
        ],
        rating: [
          { value: team.numberOfStars, disabled: true },
          [ Validators.required, Validators.min(0), Validators.max(5) ]
        ],
        cnp: [
          { value: team.cnp, disabled: true },
          [ Validators.required, Validators.pattern(/^\d{13}$/) ]
        ],
        birthDate: [
          { value: new Date(team.birthDate).toISOString().split('T')[0], disabled: true },
          [ Validators.required ]
        ]
      });
    });
  }

  private watchUser(): void {
    this.userSubscription = this.authService.user$
      .subscribe(response => this.loggedUser = response);
  }

  toggleEdit(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    this.editMode = !this.editMode;

    if (this.editMode) {
      this.teamForm.enable();
      this.teamForm.get('id')?.disable();
    } else {
      const updatedTeam = {
        ...this.teamForm.getRawValue(),
        birthDate: new Date(this.teamForm.value.birthDate).toISOString(),
        numberOfStars: this.teamForm.value.rating
      };

      this.teamService.update(updatedTeam.id, updatedTeam).subscribe({
        next: () => {
          this.teamForm.disable();
          this.modalService.open('Success', 'Team has been successfully updated!', ModalType.SUCCESS);
        },
        error: (error: HttpErrorResponse) => {
          this.modalService.open('Error', error.error.message, ModalType.ERROR);
        }
      });
    }
  }

  deleteTeam(): void {
    this.modalService.open('Delete', 'Are you sure you want to delete this team?', ModalType.CONFIRM);
  }

  private watchTeamDeletion(): void {
    this.modalService.confirm$
      .pipe(takeUntil(this.subject$))
      .subscribe(() => {
        this.teamService.delete(this.teamId).subscribe({
          next: () => {
            this.modalService.open('Deleted', 'Team has been deleted.', ModalType.SUCCESS);
            this.router.navigateByUrl(ROUTES.TEAMS).then();
          },
          error: (error: HttpErrorResponse) => {
            this.modalService.open('Error', error.error.message, ModalType.ERROR);
          }
        });
      });
  }

  protected readonly Role = Role;
}
