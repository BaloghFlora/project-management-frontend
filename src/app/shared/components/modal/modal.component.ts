import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalType } from '../../models/modal-type.enum';


@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  imports: [
    NgClass
  ],
  styleUrls: [ './modal.component.scss' ]
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() type: ModalType = ModalType.INFO;
  @Output() close = new EventEmitter<void>();
  @Output() accept = new EventEmitter<void>();

  protected readonly ModalType = ModalType;

  closeModal(): void {
    this.close.emit();
  }

  acceptModal(): void {
    this.accept.emit();
  }
}
