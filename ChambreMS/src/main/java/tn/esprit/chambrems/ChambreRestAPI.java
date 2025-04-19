package tn.esprit.chambrems;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/chambre")
@CrossOrigin(origins = "http://localhost:4200")
public class ChambreRestAPI {
    @Autowired
    private ChambreService chambreService;

    // Endpoint pour télécharger le PDF des chambres
    @GetMapping(value = "/export/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<Resource> downloadChambresAsPdf() {
        System.out.println("===== TÉLÉCHARGEMENT DU PDF DEPUIS LE CONTROLLER =====");
        try {
            ByteArrayResource resource = chambreService.exportChambresToPDF();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ListeChambres.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(resource.contentLength())
                    .body(resource);
        } catch (Exception e) {
            System.out.println("Échec : Erreur lors du téléchargement du PDF -> " + e.getMessage());
            e.printStackTrace();
            System.out.println("=====================================");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 2. Récupérer toutes les chambres
    @GetMapping("/all")
    public ResponseEntity<List<Chambre>> getAllChambres() {
        System.out.println("===== RÉCUPÉRATION DE TOUTES LES CHAMBRES =====");
        List<Chambre> chambres = chambreService.getAllChambres();
        System.out.println("Nombre de chambres récupérées : " + chambres.size());
        System.out.println("Liste des chambres : " + chambres);
        System.out.println("============================================");
        return ResponseEntity.ok(chambres);
    }

    // 2. Récupérer une chambre par ID
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<Chambre> getChambreById(@PathVariable Long id) {
        System.out.println("===== RÉCUPÉRATION CHAMBRE PAR ID =====");
        System.out.println("ID demandé : " + id);
        Optional<Chambre> chambre = chambreService.getChambreById(id);
        if (chambre.isPresent()) {
            System.out.println("Succès : Chambre trouvée -> " + chambre.get());
            System.out.println("===================================");
            return ResponseEntity.ok(chambre.get());
        } else {
            System.out.println("Échec : Aucune chambre trouvée pour l'ID " + id);
            System.out.println("===================================");
            return ResponseEntity.notFound().build();
        }
    }

    // Ajouter une chambre
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Chambre> ajouterChambre(
            @RequestPart("chambre") Chambre chambre,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        try {
            if (image != null && !image.isEmpty()) {
                String imagePath = saveImageToFileSystem(image);
                chambre.setImageUrl(imagePath);
            }

            Chambre nouvelleChambre = chambreService.ajouterChambre(chambre);
            return ResponseEntity.ok(nouvelleChambre);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 4. Modifier une chambre
    @PutMapping(value = "/update/{id:\\d+}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Chambre> updateChambre(
            @PathVariable Long id,
            @RequestPart("chambre") Chambre chambreDetails,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        try {
            // Récupérer la chambre existante pour conserver l'URL de l'image si nécessaire
            Optional<Chambre> existingChambreOpt = chambreService.getChambreById(id);
            if (!existingChambreOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Chambre existingChambre = existingChambreOpt.get();

            // Si une nouvelle image est fournie, la sauvegarder et mettre à jour l'URL
            if (image != null && !image.isEmpty()) {
                String imagePath = saveImageToFileSystem(image);
                chambreDetails.setImageUrl(imagePath);
            } else {
                // Si aucune nouvelle image n'est fournie, conserver l'URL de l'image actuelle
                chambreDetails.setImageUrl(existingChambre.getImageUrl());
            }

            Chambre updatedChambre = chambreService.updateChambre(id, chambreDetails);
            return ResponseEntity.ok(updatedChambre);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 5. Supprimer une chambre
    @DeleteMapping("/delete/{id:\\d+}")
    public ResponseEntity<Void> deleteChambre(@PathVariable Long id) {
        System.out.println("===== SUPPRESSION D'UNE CHAMBRE =====");
        System.out.println("ID à supprimer : " + id);
        chambreService.deleteChambre(id);
        System.out.println("Succès : Chambre supprimée avec l'ID " + id);
        System.out.println("===================================");
        return ResponseEntity.noContent().build();
    }

    // Endpoint pour télécharger la chambre avec l'image
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<Chambre> uploadChambreWithImage(
            @RequestParam("chambre") String chambreJson,
            @RequestParam("image") MultipartFile image) {
        System.out.println("===== TÉLÉCHARGEMENT D'UNE CHAMBRE AVEC IMAGE =====");
        System.out.println("JSON reçu : " + chambreJson);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Chambre chambre = objectMapper.readValue(chambreJson, Chambre.class);
            System.out.println("Chambre analysée : " + chambre);

            // Sauvegarder l'image
            String imagePath = saveImageToFileSystem(image);
            System.out.println("Chemin de l'image défini : " + imagePath);

            chambre.setImageUrl(imagePath);
            System.out.println("Chambre avec URL d'image : " + chambre);

            Chambre savedChambre = chambreService.ajouterChambre(chambre);
            System.out.println("Succès : Chambre enregistrée -> " + savedChambre);
            System.out.println("==============================================");
            return ResponseEntity.ok(savedChambre);
        } catch (Exception e) {
            System.out.println("Échec : Erreur lors du téléchargement -> " + e.getMessage());
            e.printStackTrace();
            System.out.println("==============================================");
            return ResponseEntity.badRequest().build();
        }
    }

    // Sauvegarder l'image sur le système de fichiers
    private String saveImageToFileSystem(MultipartFile image) throws IOException {
        System.out.println("----- Sauvegarde de l'image -----");
        String uploadDir = Paths.get(System.getProperty("user.dir"), "uploads").toString();
        System.out.println("Répertoire de destination : " + uploadDir);

        Files.createDirectories(Paths.get(uploadDir));
        System.out.println("Répertoire prêt : " + uploadDir);

        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        System.out.println("Enregistrement de l'image à : " + filePath);

        Files.copy(image.getInputStream(), filePath);
        if (Files.exists(filePath)) {
            System.out.println("Succès : Image enregistrée à : " + filePath);
        } else {
            System.out.println("Échec : L'image n'a pas été enregistrée à : " + filePath);
            throw new IOException("Échec de la sauvegarde de l'image : " + filePath);
        }
        System.out.println("-------------------------------");
        return "/uploads/" + fileName;
    }

    // Endpoint pour récupérer l'image
    @GetMapping("/images/{imageName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String imageName) {
        System.out.println("===== RÉCUPÉRATION D'UNE IMAGE =====");
        System.out.println("Nom de l'image demandé : " + imageName);
        try {
            String cleanImageName = imageName.startsWith("/uploads/")
                    ? imageName.substring("/uploads/".length())
                    : imageName;
            System.out.println("Nom nettoyé : " + cleanImageName);

            Path imagePath = Paths.get(System.getProperty("user.dir"), "uploads", cleanImageName);
            System.out.println("Recherche de l'image à : " + imagePath);

            Resource resource = new FileSystemResource(imagePath);
            if (resource.exists()) {
                System.out.println("Succès : Image trouvée à : " + imagePath);
                System.out.println("==================================");
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                System.out.println("Échec : Image non trouvée à : " + imagePath);
                System.out.println("==================================");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("Échec : Erreur lors de la récupération -> " + e.getMessage());
            e.printStackTrace();
            System.out.println("==================================");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Rechercher les chambres disponibles par type
    @GetMapping("/disponibles/type/{type}")
    public ResponseEntity<List<Chambre>> getChambresDisponiblesParType(@PathVariable TypeChambre type) {
        System.out.println("===== RECHERCHE CHAMBRES DISPONIBLES PAR TYPE =====");
        System.out.println("Type demandé : " + type);
        List<Chambre> chambres = chambreService.getChambresDisponiblesParType(type);
        System.out.println("Nombre de chambres trouvées : " + chambres.size());
        System.out.println("Résultat : " + chambres);
        System.out.println("==============================================");
        return ResponseEntity.ok(chambres);
    }

    // Filtrer les chambres par plage de prix
    @GetMapping("/filterByPrix")
    public ResponseEntity<List<Chambre>> getChambresByPrixRange(
            @RequestParam double min,
            @RequestParam double max) {
        System.out.println("===== FILTRE CHAMBRES PAR PRIX =====");
        System.out.println("Plage de prix : " + min + " à " + max);
        List<Chambre> chambres = chambreService.getChambresByPrixRange(min, max);
        System.out.println("Nombre de chambres trouvées : " + chambres.size());
        System.out.println("Résultat : " + chambres);
        System.out.println("==================================");
        return ResponseEntity.ok(chambres);
    }

    // Changer la disponibilité d'une chambre
    @PutMapping("/disponibilite/{id:\\d+}")
    public ResponseEntity<Chambre> changerDisponibilite(@PathVariable Long id, @RequestParam boolean etat) {
        System.out.println("===== CHANGEMENT DE DISPONIBILITÉ =====");
        System.out.println("ID : " + id + " | Nouvel état : " + etat);
        Chambre updatedChambre = chambreService.changerDisponibilite(id, etat);
        System.out.println("Succès : Disponibilité mise à jour -> " + updatedChambre);
        System.out.println("=====================================");
        return ResponseEntity.ok(updatedChambre);
    }

    // Recommander des chambres similaires
    @GetMapping("/recommander/{id:\\d+}")
    public ResponseEntity<List<Chambre>> recommander(@PathVariable Long id) {
        System.out.println("===== RECOMMANDATION DE CHAMBRES =====");
        System.out.println("ID de référence : " + id);
        List<Chambre> recommandations = chambreService.recommanderChambresSimilaires(id);
        System.out.println("Nombre de recommandations : " + recommandations.size());
        System.out.println("Résultat : " + recommandations);
        System.out.println("====================================");
        return ResponseEntity.ok(recommandations);
    }

    // Ajouter un historique d'occupation
    @PostMapping("/{id:\\d+}/historique")
    public ResponseEntity<HistoriqueOccupation> ajouterHistorique(
            @PathVariable Long id,
            @RequestBody HistoriqueOccupation historique) {
        System.out.println("===== AJOUT D'HISTORIQUE D'OCCUPATION =====");
        System.out.println("ID de la chambre : " + id);
        System.out.println("Détails de l'historique : " + historique);
        try {
            HistoriqueOccupation historiqueAjoute = chambreService.ajouterHistorique(id,
                    historique.getLocataire(),
                    historique.getDateDebut(),
                    historique.getDateFin(),
                    historique.getDuree());
            System.out.println("Succès : Historique ajouté -> " + historiqueAjoute);
            System.out.println("=========================================");
            return ResponseEntity.ok(historiqueAjoute);
        } catch (Exception e) {
            System.out.println("Échec : Erreur lors de l'ajout -> " + e.getMessage());
            System.out.println("=========================================");
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Récupérer l'historique d'occupation
    @GetMapping("/{id:\\d+}/historique")
    public ResponseEntity<List<HistoriqueOccupation>> getHistorique(@PathVariable Long id) {
        System.out.println("===== RÉCUPÉRATION HISTORIQUE D'OCCUPATION =====");
        System.out.println("ID de la chambre : " + id);
        List<HistoriqueOccupation> historiques = chambreService.getHistoriqueOccupation(id);
        System.out.println("Nombre d'entrées trouvées : " + historiques.size());
        System.out.println("Résultat : " + historiques);
        System.out.println("=============================================");
        return ResponseEntity.ok(historiques);
    }
}