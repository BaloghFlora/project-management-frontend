import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TeamService } from '../../../core/services/team/team.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { buildChefFilterDTOFromSearchBy } from '../../../core/utils/rest-utils';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ModalType } from '../../../shared/models/modal-type.enum';
import { ChefResponse } from '../models/chef-response.model';


@Component({
  selector: 'app-chefs',
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
  addChefForm!: FormGroup;
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

  private fetchChefs(searchBy: string, page: number): void {
    this.loading = true;
    const filter = buildChefFilterDTOFromSearchBy(searchBy, page);

    this.teamService.getAll(filter).subscribe({
      next: (response) => {
        this.teams = response.elements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load chefs';
        this.loading = false;
      }
    });
  }

  private buildChefForm(): void {
    this.addChefForm = this.fb.group({
      name: [ '', [ Validators.required ] ],
      cnp: [ '', [ Validators.required, Validators.pattern(/^\d{13}$/) ] ],
      birthDate: [ '', [ Validators.required ] ],
      rating: [ 0, [ Validators.required, Validators.min(0), Validators.max(5) ] ]
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  saveChef(): void {
    if (this.addChefForm.valid) {
      const newChef = {
        ...this.addChefForm.value,
        numberOfStars: this.addChefForm.value.rating,
        birthDate: new Date(this.addChefForm.value.birthDate).toISOString()
      };
      this.teamService.save(newChef).subscribe({
        next: (savedChef) => {
          this.teams.push(savedChef);
          this.addChefForm.reset();
          this.showAddForm = false;
          this.modalService.open('Success', 'Chef has been successfully added!', ModalType.SUCCESS);
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
