package tn.esprit.chambrems;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Service
public class ChambreService {
    @Autowired
    private ChambreRepository chambreRepository;
    @Autowired
    private HistoriqueOccupationRepository historiqueOccupationRepository;

    // 1. Ajouter une chambre
    public Chambre ajouterChambre(Chambre chambre) {
        return chambreRepository.save(chambre);
    }

    // 2. Obtenir toutes les chambres
    public List<Chambre> getAllChambres() {
        return chambreRepository.findAll();
    }

    // 3. Obtenir une chambre par ID
    public Optional<Chambre> getChambreById(Long id) {
        return chambreRepository.findById(id);
    }

    // 4. Mettre à jour une chambre
    public Chambre updateChambre(Long id, Chambre chambreDetails) {
        return chambreRepository.findById(id).map(chambre -> {
            chambre.setNumero(chambreDetails.getNumero());
            chambre.setType(chambreDetails.getType());
            chambre.setPrixParNuit(chambreDetails.getPrixParNuit());
            chambre.setDisponibilite(chambreDetails.isDisponibilite());
            return chambreRepository.save(chambre);
        }).orElseThrow(() -> new RuntimeException("Chambre non trouvée avec ID : " + id));
    }

    // 5. Supprimer une chambre
    public void deleteChambre(Long id) {
        chambreRepository.deleteById(id);
    }

//Rechercher les chambres disponibles par type
    public List<Chambre> getChambresDisponiblesParType(TypeChambre type) {
        return chambreRepository.findByTypeAndDisponibiliteTrue(type);
    }
    public List<Chambre> getChambresByPrixRange(double min, double max) {
        return chambreRepository.findByPrixParNuitBetween(min, max);
    }

    public Chambre changerDisponibilite(Long id, boolean disponibilite) {
        Chambre ch = chambreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée"));
        ch.setDisponibilite(disponibilite);
        return chambreRepository.save(ch);
    }

    public List<Chambre> recommanderChambresSimilaires(Long chambreId) {
        Chambre chambre = chambreRepository.findById(chambreId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée"));
        return chambreRepository.findByTypeAndDisponibiliteTrue(chambre.getType())
                .stream().filter(c -> c.getId() != chambreId).toList();
    }


    public HistoriqueOccupation ajouterHistorique(Long chambreId, String locataire, LocalDate dateDebut, LocalDate dateFin, int duree) {
        Chambre chambre = chambreRepository.findById(chambreId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée"));

        HistoriqueOccupation historique = new HistoriqueOccupation();
        historique.setChambre(chambre);
        historique.setLocataire(locataire);
        historique.setDateDebut(dateDebut);
        historique.setDateFin(dateFin);
        historique.setDuree(duree);

        return historiqueOccupationRepository.save(historique);
    }
    // Récupérer l'historique d'occupation d'une chambre
    public List<HistoriqueOccupation> getHistoriqueOccupation(Long chambreId) {
        return historiqueOccupationRepository.findByChambreId(chambreId);
    }
}
