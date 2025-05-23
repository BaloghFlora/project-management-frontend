// feature/teams/teams/teams.component.ts
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TeamService } from '../../../core/services/team/team.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { buildTeamFilterDTOFromSearchBy } from '../../../core/utils/rest-utils';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ModalType } from '../../../shared/models/modal-type.enum';
import { TeamResponse } from '../models/team-response.model';

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
export class TeamsComponent implements OnInit {

  teams: TeamResponse[] = [];
  loading = true;
  error: string | null = null;
  addTeamForm!: FormGroup;
  showAddForm = false;
  currentPage = 0;
  totalPages = -1;

  constructor(
    private teamService: TeamService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const searchBy = params.get('searchBy') ?? '';
      this.currentPage = +(params.get('page') ?? '0');
      this.fetchTeams(searchBy, this.currentPage);
    });
    this.buildTeamForm();
  }

  private fetchTeams(searchBy: string, page: number): void {
    this.loading = true;
    const filter = buildTeamFilterDTOFromSearchBy(searchBy, page);

    this.teamService.getAll(filter).subscribe({
      next: (response) => {
        this.teams = response.elements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load teams';
        this.loading = false;
      }
    });
  }

  private buildTeamForm(): void {
    this.addTeamForm = this.fb.group({
      name: [ '', [ Validators.required ] ],
      cnp: [ '', [ Validators.required, Validators.pattern(/^\d{13}$/) ] ],
      birthDate: [ '', [ Validators.required ] ],
      rating: [ 0, [ Validators.required, Validators.min(0), Validators.max(5) ] ]
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  saveTeam(): void {
    if (this.addTeamForm.valid) {
      const newTeam = {
        ...this.addTeamForm.value,
        numberOfStars: this.addTeamForm.value.rating,
        birthDate: new Date(this.addTeamForm.value.birthDate).toISOString()
      };
      this.teamService.save(newTeam).subscribe({
        next: (savedTeam) => {
          this.teams.push(savedTeam);
          this.addTeamForm.reset();
          this.showAddForm = false;
          this.modalService.open('Success', 'Team has been successfully added!', ModalType.SUCCESS);
        },
        error: (error: HttpErrorResponse) => {
          this.modalService.open('Error', error.error.message, ModalType.ERROR);
        }
      });
    }
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
  }
}
