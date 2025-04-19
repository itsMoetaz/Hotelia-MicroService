export interface HistoriqueOccupation {
    id?: number;
    chambre?: any; // Référence à la chambre (peut être simplifié si non utilisé côté frontend)
    locataire: string;
    dateDebut: string; // Utilisation de string pour compatibilité avec les formulaires (sera converti en LocalDate côté backend)
    dateFin: string;
    duree: number;
  }