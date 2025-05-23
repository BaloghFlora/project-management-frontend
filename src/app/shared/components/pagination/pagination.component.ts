import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 0;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router: Router) {
    this.router = router;
  }

  *pageRange(): Iterable<number> {
    for (let i = 0; i < this.totalPages; i++) {
      yield i;
    }
  }

  changePage(page: number): void {
    if (page < 0 || page > this.totalPages - 1 || page === this.currentPage) {
      return;
    }

    this.pageChange.emit(page);

    const currentUrl = this.router.url.split('?')[0];
    this.router.navigate([ currentUrl ], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    }).then();
  }
}
