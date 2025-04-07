import { Component, OnInit } from '@angular/core';
import { Chambre } from '../models/Chambre.model';
import { ChambreService } from '../services/chambre.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  chambres: Chambre[] = [];
  imageErrors: { [key: number]: boolean } = {};
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private chambreService: ChambreService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChambres();
  }

  showModal: boolean = false; // état pour afficher/masquer le modal
  
  // Fonction pour ouvrir le modal
  openModal(): void {
    this.showModal = true;
  }

  // Fonction pour fermer le modal
  closeModal(): void {
    this.showModal = false;
  }

  // Chargement des chambres avec gestion d'erreur
  loadChambres(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.chambreService.getChambres().subscribe({
      next: (data) => {
        this.chambres = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement:', err);
        this.errorMessage = 'Échec du chargement des chambres';
        this.isLoading = false;
      }
    });
  }

  // Génération d'une URL sécurisée pour les images
  getSafeImageUrl(imageName: string): SafeUrl {
    if (!imageName) {
        return this.sanitizer.bypassSecurityTrustUrl('assets/no-image.png');
    }
    const cleanImageName = imageName.startsWith('/uploads/') 
        ? imageName.replace('/uploads/', '') 
        : imageName;
    const url = `${this.chambreService.baseUrl}/images/${encodeURIComponent(cleanImageName)}`;
    console.log("Image URL requested: " + url);
    return this.sanitizer.bypassSecurityTrustUrl(url);
}
  // Gestion des erreurs d'image
  handleImageError(chambreId: number): void {
    this.imageErrors[chambreId] = true;
  }

  // Suppression d'une chambre
  deleteChambre(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      this.chambreService.deleteChambre(id).subscribe({
        next: () => {
          this.loadChambres();
        },
        error: (err) => {
          console.error('Échec de la suppression:', err);
          this.errorMessage = 'Échec de la suppression de la chambre';
        }
      });
    }
  }

  editChambre(id: number): void {
    console.log('Navigation vers édition de la chambre', id);
    // Utilise le chemin complet pour la route
    this.router.navigate([`dashboard/rooms/edit/${id}`]);
  }
  
  addChambre(): void {
    console.log('Navigation vers ajout de chambre');
    // Utilise le chemin complet pour la route
    this.router.navigate(['dashboard/rooms/add']);
  }

  navigateToAdd(): void {
    this.router.navigate(['dashboard/chambres/add']);
  }
  
  navigateToEdit(id: number): void {
    this.router.navigate(['dashboard/chambres/edit', id]);
  }
  
  
}