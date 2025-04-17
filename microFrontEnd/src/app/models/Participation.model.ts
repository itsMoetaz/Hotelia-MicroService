import { Evenement } from "./evenement.model";


export interface Participation {
    id?: number;
    email: string;
    evenement: Evenement;
    payant: boolean;
  }