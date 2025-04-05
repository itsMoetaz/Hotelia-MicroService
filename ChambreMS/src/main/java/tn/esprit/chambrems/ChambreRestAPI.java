package tn.esprit.chambrems;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/chambre")
public class ChambreRestAPI {
    @Autowired
    private ChambreService chambreService;

    // 1. Ajouter une chambre
    @PostMapping("/add")
    public ResponseEntity<Chambre> ajouterChambre(@RequestBody Chambre chambre) {
        Chambre nouvelleChambre = chambreService.ajouterChambre(chambre);
        return ResponseEntity.ok(nouvelleChambre);
    }

    // 2. Récupérer toutes les chambres
    @GetMapping("/all")
    public ResponseEntity<List<Chambre>> getAllChambres() {
        List<Chambre> chambres = chambreService.getAllChambres();
        return ResponseEntity.ok(chambres);
    }

    // 3. Récupérer une chambre par ID
    @GetMapping("/{id}")
    public ResponseEntity<Chambre> getChambreById(@PathVariable Long id) {
        Optional<Chambre> chambre = chambreService.getChambreById(id);
        return chambre.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. Modifier une chambre
    @PutMapping("/update/{id}")
    public ResponseEntity<Chambre> updateChambre(@PathVariable Long id, @RequestBody Chambre chambreDetails) {
        try {
            Chambre updatedChambre = chambreService.updateChambre(id, chambreDetails);
            return ResponseEntity.ok(updatedChambre);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Supprimer une chambre
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteChambre(@PathVariable Long id) {
        chambreService.deleteChambre(id);
        return ResponseEntity.noContent().build();
    }

//Rechercher les chambres disponibles par type
    @GetMapping("/disponibles/type/{type}")
    public ResponseEntity<List<Chambre>> getChambresDisponiblesParType(@PathVariable TypeChambre type) {
        List<Chambre> chambres = chambreService.getChambresDisponiblesParType(type);
        return ResponseEntity.ok(chambres);
    }

    @GetMapping("/filterByPrix")
    public ResponseEntity<List<Chambre>> getChambresByPrixRange(
            @RequestParam double min,
            @RequestParam double max) {
        return ResponseEntity.ok(chambreService.getChambresByPrixRange(min, max));
    }

    @PutMapping("/disponibilite/{id}")
    public ResponseEntity<Chambre> changerDisponibilite(@PathVariable Long id, @RequestParam boolean etat) {
        return ResponseEntity.ok(chambreService.changerDisponibilite(id, etat));
    }

    @GetMapping("/recommander/{id}")
    public ResponseEntity<List<Chambre>> recommander(@PathVariable Long id) {
        return ResponseEntity.ok(chambreService.recommanderChambresSimilaires(id));
    }


    // Endpoint pour ajouter un historique d'occupation
    @PostMapping("/{id}/historique")
    public ResponseEntity<HistoriqueOccupation> ajouterHistorique(
            @PathVariable Long id,
            @RequestBody HistoriqueOccupation historique) {

        try {
            // Appel du service pour ajouter l'historique
            HistoriqueOccupation historiqueAjoute = chambreService.ajouterHistorique(id,
                    historique.getLocataire(),
                    historique.getDateDebut(),
                    historique.getDateFin(),
                    historique.getDuree());
            return ResponseEntity.ok(historiqueAjoute);
        } catch (Exception e) {
            // Retour d'une réponse 400 en cas d'erreur
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Endpoint pour récupérer l'historique d'occupation d'une chambre
    @GetMapping("/{id}/historique")
    public ResponseEntity<List<HistoriqueOccupation>> getHistorique(@PathVariable Long id) {
        List<HistoriqueOccupation> historiques = chambreService.getHistoriqueOccupation(id);
        return ResponseEntity.ok(historiques);
    }
}
