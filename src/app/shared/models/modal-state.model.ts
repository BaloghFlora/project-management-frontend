import { ModalType } from './modal-type.enum';


export interface ModalState {
  show: boolean;
  title: string;
  message: string;
  type: ModalType;
}
