package tn.esprit.chambrems;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chambres")
@Getter
@Setter
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
}
