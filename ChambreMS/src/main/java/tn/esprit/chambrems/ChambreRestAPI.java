package tn.esprit.chambrems;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Chambre> getChambreById(@PathVariable int id) {
        Optional<Chambre> chambre = chambreService.getChambreById(id);
        return chambre.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. Modifier une chambre
    @PutMapping("/update/{id}")
    public ResponseEntity<Chambre> updateChambre(@PathVariable int id, @RequestBody Chambre chambreDetails) {
        try {
            Chambre updatedChambre = chambreService.updateChambre(id, chambreDetails);
            return ResponseEntity.ok(updatedChambre);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Supprimer une chambre
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteChambre(@PathVariable int id) {
        chambreService.deleteChambre(id);
        return ResponseEntity.noContent().build();
    }
}
