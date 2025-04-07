package tn.esprit.chambrems;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoriqueOccupationRepository  extends CrudRepository<HistoriqueOccupation, Long> {
    // Méthode pour récupérer tous les historiques d'occupation d'une chambre par son ID
    List<HistoriqueOccupation> findByChambreId(Long chambreId);
}
