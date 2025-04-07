package com.esprit.microservice.evenement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class EvenementService {

    @Autowired
    private EvenementRepository evenementeRepository;
    @Autowired
    private TwilioSmsSender service ;


    //en va prend a la suite user connecte
   private final String userPhoneNumber = "+21623369399";

    //récuperer tous evenements
    public List<Evenement> getAll()
    {return evenementeRepository.findAll();}


    //recupere evenement par id
    public Evenement getEvenementById(Integer id) {
        return evenementeRepository.findById(id).orElseThrow(() -> new RuntimeException("Evenement non trouvé"));
    }


    //add evenements avec condition de type et sms pour les evenements gratuit
    public Evenement addEvenement(Evenement e) {

            // Si l'événement est GRATUIT, on fixe le prix à 0
            if (e.getEtat() == EtatEvenement.GRATUIT && e.getPrix() >0 ){
                throw new IllegalArgumentException("Le prix doit être vide ou 0  !"); // Assurez-vous que le prix est 0 pour un événement GRATUIT
            }

            // Si l'événement est PAYANT, on vérifie que le prix est renseigné
            if (e.getEtat() == EtatEvenement.PAYANT &&  e.getPrix() <= 0)  {
                throw new IllegalArgumentException("Le prix doit être renseigné et supérieur à 0 pour un événement PAYANT !");
            }


        if (e.getEtat() == EtatEvenement.GRATUIT) {
            String message = String.format("🎉 Profitez ! L'événement '%s' est GRATUIT au %s, prévu pour le %s. Ne manquez pas cette opportunité ! 🎁",
                    e.getNom(), e.getLieu(), e.getDateDebut().toString());
            service.sendSmsAdd(userPhoneNumber, message);
        }
            // Sauvegarde de l'événement
            return evenementeRepository.save(e);
    }


    //filtrage par etat
    public List<Evenement> getEvenementsByEtat(EtatEvenement etat) {
        return evenementeRepository.findByEtat(etat);
    }


    //trier les evenements seulment payant par ordre croissant
    public List<Evenement> getEvenementsSortedByPrixAsc() {
        List<Evenement> payants = evenementeRepository.findByEtatOrderByPrixAsc(EtatEvenement.PAYANT);

        if (payants.isEmpty()) {
            return null; // Ou tu peux lever une exception personnalisée
        }

        return payants;
    }


    //trier les evenements seulment payant par ordre décroissant
    public List<Evenement> getEvenementsSortedByPrixDesc() {
        List<Evenement> payants = evenementeRepository.findByEtatOrderByPrixDesc(EtatEvenement.PAYANT);

        if (payants.isEmpty()) {
            return null; // Ou tu peux lever une exception personnalisée
        }

        return payants;
    }





    //modifier venenemnts
    public Evenement updateEvenement(int id, Evenement evenement) {
        if (evenementeRepository.findById(id).isPresent()) {

            Evenement existing = evenementeRepository.findById(id).get();
            existing.setNom(evenement.getNom());
            existing.setDescription(evenement.getDescription());
            existing.setDateDebut(evenement.getDateDebut());
            existing.setDateFin(evenement.getDateFin());
            existing.setLieu(evenement.getLieu());
            existing.setPrix(evenement.getPrix());
            existing.setPrix(evenement.getLikes());
            existing.setPrix(evenement.getDislikes());

            return evenementeRepository.save(existing);
        } else
            return null;
    }
    public String deleteEvenement(int id) {
        if (evenementeRepository.findById(id).isPresent()) {
            evenementeRepository.deleteById(id);
            return "evenement supprimé";
        } else
            return "evenement non supprimé";
    }
}
