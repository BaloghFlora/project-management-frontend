import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalState } from '../../../shared/models/modal-state.model';
import { ModalType } from '../../../shared/models/modal-type.enum';


@Injectable({ providedIn: 'root' })
export class ModalService {
  modalState = signal<ModalState>({
    show: false,
    title: '',
    message: '',
    type: ModalType.INFO
  });

  private confirmSubject = new Subject<void>();
  confirm$ = this.confirmSubject.asObservable();

  open(title: string, message: string, type: ModalType = ModalType.INFO): void {
    this.modalState.set({ show: true, title, message, type });
  }

  close(): void {
    this.modalState.update(state => ({ ...state, show: false }));
  }

  accept(): void {
    this.confirmSubject.next();
    this.close();
  }
}
