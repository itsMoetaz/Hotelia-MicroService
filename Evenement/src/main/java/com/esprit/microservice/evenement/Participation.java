package com.esprit.microservice.evenement;


import jakarta.persistence.*;

@Entity
public class Participation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String email;  // Email de l'employé

    @ManyToOne
    @JoinColumn(name = "evenement_id")
    private Evenement evenement;

    private boolean payant;

    public Participation() {
    }

    // Constructeurs, getters, setters
    public Participation(String email, Evenement evenement, boolean payant) {
        this.email = email;
        this.evenement = evenement;
        this.payant = payant;
    }

    public int getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Evenement getEvenement() {
        return evenement;
    }

    public boolean isPayant() {
        return payant;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setEvenement(Evenement evenement) {
        this.evenement = evenement;
    }

    public void setPayant(boolean payant) {
        this.payant = payant;
    }
}
