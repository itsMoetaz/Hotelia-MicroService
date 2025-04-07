package com.esprit.microservice.evenement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/evenements")
public class EvenementRestApi {

    @Autowired
    private EvenementService evenementService;

    //ajouter evenement
    @PostMapping(value = "/add")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Evenement> createEvenement(@RequestBody Evenement evenement) {
        try {
            Evenement addedEvenement = evenementService.addEvenement(evenement);
            return new ResponseEntity<>(addedEvenement, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Retourner une réponse 400 Bad Request si le prix est manquant pour un événement PAYANT
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

//filtrer par etat
    @GetMapping("/filter/{etat}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<Evenement>> getEvenementsByEtat(@PathVariable  EtatEvenement etat) {
        List<Evenement> evenements = evenementService.getEvenementsByEtat(etat);
        return new ResponseEntity<>(evenements, HttpStatus.OK);
    }
    //recuperer tous evenements
    @RequestMapping
    public ResponseEntity<List<Evenement>> getAll() {
        return new ResponseEntity<>(evenementService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/sorted/desc")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getPayantsSortedDesc() {
        List<Evenement> evenements = evenementService.getEvenementsSortedByPrixDesc();

        if (evenements == null) {
            return new ResponseEntity<>("Aucun événement payant trouvé", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(evenements, HttpStatus.OK);
    }

    @GetMapping("/sorted/asc")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getPayantsSortedAsc() {
        List<Evenement> evenements = evenementService.getEvenementsSortedByPrixAsc();

        if (evenements == null) {
            return new ResponseEntity<>("Aucun événement payant trouvé", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(evenements, HttpStatus.OK);
    }

    //modifier evenements
    @PutMapping (value = "/update/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Evenement> updateEvenement(@PathVariable(value = "id") int id,
                                                   @RequestBody Evenement evenement){
        return new ResponseEntity<>(evenementService.updateEvenement(id, evenement),
                HttpStatus.OK);
    }


    @GetMapping (value = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<Evenement> getEvenementById(@PathVariable(value = "id") int id){
        return new ResponseEntity<>(evenementService.getEvenementById(id), HttpStatus.OK);
    }
    //supprimer evenements
    @DeleteMapping(value = "/delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> deleteEvenement(@PathVariable(value = "id") int id){
        return new ResponseEntity<>(evenementService.deleteEvenement(id), HttpStatus.OK);
    }
}
