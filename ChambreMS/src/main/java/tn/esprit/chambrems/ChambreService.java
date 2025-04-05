package tn.esprit.chambrems;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ChambreService {
    @Autowired
    private ChambreRepository chambreRepository;

    // 1. Ajouter une chambre
    public Chambre ajouterChambre(Chambre chambre) {
        return chambreRepository.save(chambre);
    }

    // 2. Obtenir toutes les chambres
    public List<Chambre> getAllChambres() {
        return chambreRepository.findAll();
    }

    // 3. Obtenir une chambre par ID
    public Optional<Chambre> getChambreById(int id) {
        return chambreRepository.findById(id);
    }

    // 4. Mettre à jour une chambre
    public Chambre updateChambre(int id, Chambre chambreDetails) {
        return chambreRepository.findById(id).map(chambre -> {
            chambre.setNumero(chambreDetails.getNumero());
            chambre.setType(chambreDetails.getType());
            chambre.setPrixParNuit(chambreDetails.getPrixParNuit());
            chambre.setDisponibilite(chambreDetails.isDisponibilite());
            return chambreRepository.save(chambre);
        }).orElseThrow(() -> new RuntimeException("Chambre non trouvée avec ID : " + id));
    }

    // 5. Supprimer une chambre
    public void deleteChambre(int id) {
        chambreRepository.deleteById(id);
    }
}
