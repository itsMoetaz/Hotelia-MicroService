export enum TypeChambre {
    SIMPLE = 'SIMPLE',
    DOUBLE = 'DOUBLE',
    SUITE = 'SUITE',
    FAMILIALE = 'DELUXE'
  }
  
  export interface Chambre {
    id: number;
    numero: string;
    type: TypeChambre;
    prixParNuit: number;
    disponibilite: boolean;
    imageUrl: string;
    description: string;
    historiques: any[];  
  }