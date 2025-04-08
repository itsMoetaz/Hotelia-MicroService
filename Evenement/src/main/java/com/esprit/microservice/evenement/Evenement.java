package com.esprit.microservice.evenement;

import jakarta.persistence.*;
import org.apache.commons.lang.ObjectUtils;

import java.time.LocalDate;
import java.util.Objects;

@Entity
public class Evenement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    private String nom;

    private String description;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private String lieu;

    private double prix;

    private int nbParticipationTotal;


    @Enumerated(EnumType.STRING)
    private EtatEvenement etat;


    private int likes = 0;
    private int dislikes = 0;



    public Evenement() {}

    public Evenement(String nom, String description, LocalDate dateDebut, LocalDate dateFin, String lieu, double prix, EtatEvenement etat, int likes, int dislikes) {
        this.nom = nom;
        this.description = description;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.lieu = lieu;
        this.prix = prix;
        this.etat = etat;
        this.likes = likes;
        this.dislikes = dislikes;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public String getLieu() {
        return lieu;
    }

    public void setLieu(String lieu) {
        this.lieu = lieu;
    }

    public double getPrix() {
        return prix;
    }


    public void setPrix(double prix) {

            this.prix = prix;

    }

    public EtatEvenement getEtat() {
        return etat;
    }

    public void setEtat(EtatEvenement etat) {
        this.etat = etat;

    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getDislikes() {
        return dislikes;
    }

    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }


    public int getNbParticipationTotal() {
        return nbParticipationTotal;
    }

    public void setNbParticipationTotal(int nbParticipationTotal) {
        this.nbParticipationTotal = nbParticipationTotal;
    }

    @Override
    public String toString() {
        return "Evenement{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", description='" + description + '\'' +
                ", dateDebut=" + dateDebut +
                ", dateFin=" + dateFin +
                ", lieu='" + lieu + '\'' +
                ", prix=" + prix +
                ", etat=" + etat +
                ", likes=" + likes +
                ", dislikes=" + dislikes +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Evenement evenement = (Evenement) o;
        return Double.compare(prix, evenement.prix) == 0 && etat == evenement.etat;
    }

    @Override
    public int hashCode() {
        return Objects.hash(prix, etat);
    }
}
