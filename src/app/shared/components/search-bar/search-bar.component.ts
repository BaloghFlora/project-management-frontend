import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search-bar',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      search: [ '' ]
    });
  }

  onSearch(): void {
    if (!this.form.valid) {
      return;
    }

    const searchValue = this.form.get('search')?.value;
    const currentUrl = this.router.url.split('?')[0];

    this.router.navigate([ currentUrl ], {
      queryParams: { searchBy: searchValue || null },
      queryParamsHandling: 'merge'
    }).then();
  }
}
