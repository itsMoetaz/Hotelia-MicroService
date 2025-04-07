package tn.esprit.chambrems;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "chambres")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chambre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numero;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeChambre type;

    @Column(nullable = false)
    private double prixParNuit;

    @Column(nullable = false)
    private boolean disponibilite = true;

    // Nouveau champ pour l'image (URL ou chemin)
    @Column(name = "image_url")
    private String imageUrl; // Vous pouvez aussi utiliser byte[] si vous stockez l'image directement

    // Relation OneToMany avec HistoriqueOccupation
    @OneToMany(mappedBy = "chambre", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<HistoriqueOccupation> historiques;
}
