package tn.esprit.chambrems;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChambreRepository extends JpaRepository<Chambre, Long> {
    List<Chambre> findByTypeAndDisponibiliteTrue(TypeChambre type);
    List<Chambre> findByPrixParNuitBetween(double min, double max);

}
