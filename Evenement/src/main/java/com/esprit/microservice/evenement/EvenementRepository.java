package com.esprit.microservice.evenement;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EvenementRepository extends JpaRepository<Evenement, Integer>{
    @Query("select c from Evenement c where c.nom like :name")
    public Page<Evenement> evenementByNom(@Param("name") String n, Pageable pageable);

    //filtrage par etat
    List<Evenement> findByEtat(EtatEvenement etat);


    List<Evenement> findByEtatOrderByPrixAsc(EtatEvenement etat);

    // Récupérer les événements PAYANT triés par prix décroissant
    List<Evenement> findByEtatOrderByPrixDesc(EtatEvenement etat);
}
