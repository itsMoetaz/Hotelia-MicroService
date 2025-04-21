package com.example.gestionreservation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

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


    public enum TypeChambre {
        SIMPLE, DOUBLE, SUITE, DELUXE

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public TypeChambre getType() {
        return type;
    }

    public void setType(TypeChambre type) {
        this.type = type;
    }

    public double getPrixParNuit() {
        return prixParNuit;
    }

    public void setPrixParNuit(double prixParNuit) {
        this.prixParNuit = prixParNuit;
    }

    public boolean isDisponibilite() {
        return disponibilite;
    }

    public void setDisponibilite(boolean disponibilite) {
        this.disponibilite = disponibilite;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Chambre(String numero, TypeChambre type, double prixParNuit, boolean disponibilite, String imageUrl) {
        this.numero = numero;
        this.type = type;
        this.prixParNuit = prixParNuit;
        this.disponibilite = disponibilite;
        this.imageUrl = imageUrl;
    }
    public Chambre() {
    }

}
