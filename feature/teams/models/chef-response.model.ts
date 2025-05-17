import {TeamBase} from './chef-base.model';


export interface TeamResponse extends TeamBase {
  id: string;
  numberOfStars: number;
}
