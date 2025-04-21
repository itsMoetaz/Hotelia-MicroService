package com.example.gestionreservation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ChambreClient chambreClient;


    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public Reservation addReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public Reservation updateReservation(int id, Reservation newReservation) {
        return reservationRepository.findById(id).map(existingReservation -> {
            existingReservation.setDatedebut(newReservation.getDatedebut());
            existingReservation.setDatefin(newReservation.getDatefin());
            existingReservation.setIdchambre(newReservation.getIdchambre());
            existingReservation.setStatut(newReservation.getStatut());
            return reservationRepository.save(existingReservation);
        }).orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
    }

    public void deleteReservation(int id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Réservation non trouvée");
        }
        reservationRepository.deleteById(id);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Optional<Reservation> getReservationById(int id) {
        return reservationRepository.findById(id);
    }
    // Récupère le nombre total de réservations
    public int getTotalReservations() {
        return (int) reservationRepository.count(); // Compte toutes les réservations
    }

    // Récupère le nombre de réservations confirmées
    public int getConfirmedReservations() {
        return (int) reservationRepository.countByStatut(true); // Compte les réservations confirmées
    }

    // Récupère le nombre de réservations annulées
    public int getCanceledReservations() {
        return (int) reservationRepository.countByStatut(false); // Compte les réservations annulées
    }

    public List<Chambre> getAllChambres() {
        return chambreClient.getAllChambres();
    }

    public Chambre getChambreById(long id) {
        return chambreClient.getChambreById(id);
    }

    public List<Chambre> getFavoriteJobs(int reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).get();
        return reservation.getListchambreJobs().stream()
                .map(chambreClient::getChambreById)
                .collect(Collectors.toList());
    }

    public void saveFavoriteJob(int reservationId, Long ChambreId) {
        Reservation reservation = reservationRepository.findById(reservationId).get();
        reservation.getListchambreJobs().add(ChambreId);
        reservationRepository.save(reservation);
    }

}
