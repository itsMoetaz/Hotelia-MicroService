export interface Evenement {
    id?: number;
    nom: string;
    description: string;
    dateDebut: string; // ISO date string (e.g., "2025-04-16")
    dateFin: string;
    lieu: string;
    prix: number;
    nbParticipationTotal: number;
    etat: 'PAYANT' | 'GRATUIT';
    likes: number;
    dislikes: number;
  }