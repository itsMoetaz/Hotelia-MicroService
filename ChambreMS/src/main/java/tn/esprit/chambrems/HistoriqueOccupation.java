package tn.esprit.chambrems;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoriqueOccupation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chambre_id", nullable = false)
    private Chambre chambre;

    private String locataire; // Nom du locataire
    private LocalDate dateDebut; // Date de début d'occupation
    private LocalDate dateFin; // Date de fin d'occupation
    private int duree; // Durée en jours

}
