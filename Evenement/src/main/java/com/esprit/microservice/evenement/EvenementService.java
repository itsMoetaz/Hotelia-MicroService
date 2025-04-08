package com.esprit.microservice.evenement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvenementService {

    @Autowired
    private EvenementRepository evenementeRepository;

    @Autowired
    private ParticipationRepository participationRepository;

    @Autowired
    private TwilioSmsSender service ;

    private final String EMAIL_STATIQUE = "employe8@example.com";


    //en va prend a la suite user connecte
   private final String userPhoneNumber = "+21623369399";

    //récuperer tous evenements
    public List<Evenement> getAll()
    {return evenementeRepository.findAll();}


    //recupere evenement par id
    public Evenement getEvenementById(Integer id) {
        return evenementeRepository.findById(id).orElseThrow(() -> new RuntimeException("Evenement non trouvé"));
    }


    //modifier envenemnts
    public Evenement updateEvenement(int id, Evenement evenement) {
        if (evenementeRepository.findById(id).isPresent()) {

            Evenement existing = evenementeRepository.findById(id).get();
            existing.setNom(evenement.getNom());
            existing.setDescription(evenement.getDescription());
            existing.setDateDebut(evenement.getDateDebut());
            existing.setDateFin(evenement.getDateFin());
            existing.setLieu(evenement.getLieu());
            existing.setPrix(evenement.getPrix());


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


    /********services avancées **/

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




    // Méthode pour participer à un événement
    public String participerAEvenement(int evenementId) {
        // Vérifier si l'événement existe
        Optional<Evenement> evenementOptional = evenementeRepository.findById(evenementId);
        if (evenementOptional.isEmpty()) {
            return "Événement non trouvé.";
        }

        Evenement evenement = evenementOptional.get();

        // Vérifier si l'employé a déjà participé à cet événement
        Optional<Participation> participationExistante = participationRepository
                .findByEmailAndEvenement(EMAIL_STATIQUE, evenement);

        if (participationExistante.isPresent()) {
            return "L'employé a déjà participé à cet événement.";
        }

        // Si l'événement est payant et que l'employé a déjà participé à un événement payant
        if (evenement.getPrix() > 0 && participationExistante.isPresent()) {
            return "L'employé ne peut participer à un événement payant plus d'une fois.";
        }

        // Ajouter la participation
        Participation participation = new Participation(EMAIL_STATIQUE, evenement, evenement.getPrix() > 0);
        participationRepository.save(participation);

        // Mettre à jour le nombre de participations pour l'événement
      evenement.setNbParticipationTotal(evenement.getNbParticipationTotal() + 1);  // Augmenter le compteur de participation
        evenementeRepository.save(evenement);
        String message = String.format("🎉 Vous avez réussi à vous inscrire à l'événement '%s'. Rendez-vous le %s à l'hotel %s. À bientôt !",
                evenement.getNom(), evenement.getDateDebut(), evenement.getLieu());
        service.sendSmsAdd(userPhoneNumber, message);
        return "L'employé a participé avec succès à l'événement.";
    }




}
