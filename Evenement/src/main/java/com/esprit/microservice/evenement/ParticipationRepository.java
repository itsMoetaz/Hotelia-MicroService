package com.esprit.microservice.evenement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParticipationRepository extends JpaRepository<Participation, Integer> {
    Optional<Participation> findByEmailAndEvenement(String email, Evenement evenement);
}
