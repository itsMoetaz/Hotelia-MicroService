package tn.esprit.chambrems;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PiePlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ChambreService {
    @Autowired
    private ChambreRepository chambreRepository;
    @Autowired
    private HistoriqueOccupationRepository historiqueOccupationRepository;

    // 1. Ajouter une chambre
    public Chambre ajouterChambre(Chambre chambre) {
        if (chambre.getImageUrl() == null || chambre.getImageUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("L'URL de l'image est obligatoire.");
        }
        return chambreRepository.save(chambre);
    }

    // 2. Obtenir toutes les chambres
    public List<Chambre> getAllChambres() {
        return chambreRepository.findAll();
    }

    // 3. Obtenir une chambre par ID
    public Optional<Chambre> getChambreById(Long id) {
        return chambreRepository.findById(id);
    }

    // 4. Mettre à jour une chambre
    public Chambre updateChambre(Long id, Chambre chambreDetails) {
        Optional<Chambre> chambreOpt = chambreRepository.findById(id);
        if (!chambreOpt.isPresent()) {
            throw new RuntimeException("Chambre non trouvée avec l'ID : " + id);
        }

        Chambre chambre = chambreOpt.get();
        chambre.setNumero(chambreDetails.getNumero());
        chambre.setType(chambreDetails.getType());
        chambre.setPrixParNuit(chambreDetails.getPrixParNuit());
        chambre.setDisponibilite(chambreDetails.isDisponibilite());
        chambre.setImageUrl(chambreDetails.getImageUrl());
        return chambreRepository.save(chambre);
    }

    // 5. Supprimer une chambre
    public void deleteChambre(Long id) {
        chambreRepository.deleteById(id);
    }

    // Rechercher les chambres disponibles par type
    public List<Chambre> getChambresDisponiblesParType(TypeChambre type) {
        return chambreRepository.findByTypeAndDisponibiliteTrue(type);
    }

    public List<Chambre> getChambresByPrixRange(double min, double max) {
        return chambreRepository.findByPrixParNuitBetween(min, max);
    }

    public Chambre changerDisponibilite(Long id, boolean disponibilite) {
        Chambre ch = chambreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée"));
        ch.setDisponibilite(disponibilite);
        return chambreRepository.save(ch);
    }

    public List<Chambre> recommanderChambresSimilaires(Long chambreId) {
        Chambre chambre = chambreRepository.findById(chambreId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée"));
        return chambreRepository.findByTypeAndDisponibiliteTrue(chambre.getType())
                .stream().filter(c -> c.getId() != chambreId).toList();
    }

    public HistoriqueOccupation ajouterHistorique(Long chambreId, String locataire, LocalDate dateDebut, LocalDate dateFin, int duree) {
        Chambre chambre = chambreRepository.findById(chambreId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée"));

        HistoriqueOccupation historique = new HistoriqueOccupation();
        historique.setChambre(chambre);
        historique.setLocataire(locataire);
        historique.setDateDebut(dateDebut);
        historique.setDateFin(dateFin);
        historique.setDuree(duree);

        return historiqueOccupationRepository.save(historique);
    }

    // Récupérer l'historique d'occupation d'une chambre
    public List<HistoriqueOccupation> getHistoriqueOccupation(Long chambreId) {
        return historiqueOccupationRepository.findByChambreId(chambreId);
    }

    public List<Chambre> processChambresFromPdf(MultipartFile pdfFile) throws IOException {
        List<Chambre> chambres = new ArrayList<>();

        try (PDDocument document = PDDocument.load(pdfFile.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            String[] lines = text.split("\n");

            for (String line : lines) {
                try {
                    Chambre chambre = parseChambreFromLine(line.trim());
                    if (chambre != null) {
                        chambres.add(ajouterChambre(chambre));
                    }
                } catch (Exception e) {
                    System.err.println("Erreur lors du parsing de la ligne : " + line + " -> " + e.getMessage());
                }
            }
        }

        return chambres;
    }

    private Chambre parseChambreFromLine(String line) {
        if (line.isEmpty()) return null;

        try {
            String[] parts = line.split(", ");
            if (parts.length < 4) return null;

            String numeroPart = parts[0].split(": ")[1];
            String typePart = parts[1].split(": ")[1];
            String prixPart = parts[2].split(": ")[1];
            String dispoPart = parts[3].split(": ")[1];

            Chambre chambre = Chambre.builder()
                    .numero(numeroPart)
                    .type(TypeChambre.valueOf(typePart.toUpperCase()))
                    .prixParNuit(Double.parseDouble(prixPart))
                    .disponibilite(dispoPart.equalsIgnoreCase("oui"))
                    .imageUrl("default.jpg")
                    .build();

            return chambre;
        } catch (Exception e) {
            System.err.println("Erreur lors du parsing : " + line + " -> " + e.getMessage());
            return null;
        }
    }

    // Méthode pour exporter les chambres en PDF
    public ByteArrayResource exportChambresToPDF() throws DocumentException {
        System.out.println("===== GÉNÉRATION DU PDF DANS LE SERVICE =====");

        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);

            // Ajouter un événement pour les en-têtes/pieds de page
            writer.setPageEvent(new HeaderFooterPageEvent());

            document.open();

            // Ajouter un titre
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 28, Font.BOLD, BaseColor.DARK_GRAY);
            Paragraph title = new Paragraph("Chambre Directory", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(30);
            document.add(title);

            // Créer un tableau pour les chambres (5 colonnes)
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setSpacingBefore(20f);
            table.setSpacingAfter(30f);

            // Ajouter une bordure extérieure pour simuler une ombre
            table.setTableEvent(new TableBorderEvent());

            // Définir les largeurs des colonnes
            float[] columnWidths = {1f, 2f, 2f, 2f, 2f};
            table.setWidths(columnWidths);

            addTableHeader(table);
            addChambreRows(table);

            // Ajouter une section pour les graphiques
            Font sectionFont = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD, BaseColor.DARK_GRAY);
            Paragraph chartsTitle = new Paragraph("Rooms Analytics", sectionFont);
            chartsTitle.setAlignment(Element.ALIGN_CENTER);
            chartsTitle.setSpacingBefore(40);
            chartsTitle.setSpacingAfter(20);
            document.add(chartsTitle);

            // Ajouter les graphiques côte à côte
            PdfPTable chartsTable = new PdfPTable(2);
            chartsTable.setWidthPercentage(90);
            chartsTable.setSpacingBefore(20f);
            chartsTable.setSpacingAfter(20f);

            // Générer et ajouter le diagramme en camembert
            Image pieChartImage = createTypeDistributionChart(350, 250);
            PdfPCell pieCell = new PdfPCell(pieChartImage);
            pieCell.setBorder(Rectangle.NO_BORDER);
            pieCell.setPadding(10);
            pieCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            chartsTable.addCell(pieCell);

            // Générer et ajouter le graphique linéaire
            Image lineChartImage = createPriceByTypeChart(350, 250);
            PdfPCell lineCell = new PdfPCell(lineChartImage);
            lineCell.setBorder(Rectangle.NO_BORDER);
            lineCell.setPadding(10);
            lineCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            chartsTable.addCell(lineCell);

            document.add(table);
            document.add(chartsTable);

            document.close();
            System.out.println("Succès : PDF généré dans le service");
            System.out.println("=====================================");
            return new ByteArrayResource(out.toByteArray());
        } catch (Exception e) {
            System.out.println("Échec : Erreur lors de la génération du PDF -> " + e.getMessage());
            e.printStackTrace();
            System.out.println("=====================================");
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }

    private void addTableHeader(PdfPTable table) {
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.WHITE);

        Stream.of("ID", "Numero", "Type", "Prix/Nuit", "Availability")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setBackgroundColor(new BaseColor(33, 150, 243)); // Bleu moderne
                    header.setBorderWidth(1.5f);
                    header.setBorderColor(BaseColor.WHITE);
                    header.setPaddingTop(12);
                    header.setPaddingBottom(12);
                    header.setHorizontalAlignment(Element.ALIGN_CENTER);
                    header.setPhrase(new Phrase(columnTitle, headerFont));
                    table.addCell(header);
                });
    }

    private void addChambreRows(PdfPTable table) {
        List<Chambre> chambres = getAllChambres();

        Font cellFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.NORMAL, BaseColor.BLACK);
        boolean alternate = false;

        for (Chambre chambre : chambres) {
            BaseColor backgroundColor = alternate ? new BaseColor(245, 245, 245) : BaseColor.WHITE; // Gris très clair pour les lignes alternées

            addCell(table, String.valueOf(chambre.getId()), backgroundColor, cellFont);
            addCell(table, chambre.getNumero(), backgroundColor, cellFont);
            addCell(table, chambre.getType().toString(), backgroundColor, cellFont);
            addCell(table, String.format("%.2f", chambre.getPrixParNuit()), backgroundColor, cellFont);
            addCell(table, chambre.isDisponibilite() ? "Yes" : "No", backgroundColor, cellFont);

            alternate = !alternate;
        }
    }

    private void addCell(PdfPTable table, String text, BaseColor backgroundColor, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPaddingTop(10);
        cell.setPaddingBottom(10);
        cell.setPaddingLeft(8);
        cell.setPaddingRight(8);
        cell.setBorderColor(new BaseColor(200, 200, 200)); // Bordure gris clair
        cell.setBorderWidth(0.5f);
        cell.setBackgroundColor(backgroundColor);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private Image createTypeDistributionChart(int width, int height) throws Exception {
        DefaultPieDataset dataset = new DefaultPieDataset();

        Map<TypeChambre, Long> typeCounts = getAllChambres().stream()
                .filter(chambre -> chambre.getType() != null)
                .collect(Collectors.groupingBy(Chambre::getType, Collectors.counting()));

        typeCounts.forEach((type, count) -> dataset.setValue(type.toString(), count));

        JFreeChart chart = ChartFactory.createPieChart(
                "Répartition des Chambres par Type",
                dataset,
                true,
                true,
                false
        );

        PiePlot plot = (PiePlot) chart.getPlot();
        plot.setOutlineVisible(false);
        plot.setBackgroundPaint(Color.WHITE);
        plot.setShadowPaint(null);
        plot.setSectionPaint("SIMPLE", new Color(66, 133, 244));
        plot.setSectionPaint("DOUBLE", new Color(46, 204, 113));
        plot.setSectionPaint("SUITE", new Color(231, 76, 60));
        plot.setLabelFont(new java.awt.Font("SansSerif", java.awt.Font.PLAIN, 12));

        BufferedImage bufferedImage = chart.createBufferedImage(width, height);
        ByteArrayOutputStream chartOut = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", chartOut);
        return Image.getInstance(chartOut.toByteArray());
    }

    private Image createPriceByTypeChart(int width, int height) throws Exception {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        Map<TypeChambre, Double> avgPriceByType = getAllChambres().stream()
                .filter(chambre -> chambre.getType() != null)
                .collect(Collectors.groupingBy(
                        Chambre::getType,
                        Collectors.averagingDouble(Chambre::getPrixParNuit)
                ));

        avgPriceByType.forEach((type, avgPrice) ->
                dataset.addValue(avgPrice, "Prix Moyen", type.toString()));

        JFreeChart chart = ChartFactory.createLineChart(
                "Prix Moyen par Type de Chambre",
                "Type",
                "Prix (TND)",
                dataset,
                PlotOrientation.VERTICAL,
                true,
                true,
                false
        );

        chart.setBackgroundPaint(Color.WHITE);
        chart.getCategoryPlot().setDomainGridlinesVisible(true);
        chart.getCategoryPlot().setRangeGridlinesVisible(true);
        chart.getCategoryPlot().setDomainGridlinePaint(Color.LIGHT_GRAY);
        chart.getCategoryPlot().setRangeGridlinePaint(Color.LIGHT_GRAY);

        BufferedImage bufferedImage = chart.createBufferedImage(width, height);
        ByteArrayOutputStream chartOut = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", chartOut);
        return Image.getInstance(chartOut.toByteArray());
    }

    // Classe pour ajouter une bordure extérieure au tableau (simule une ombre)
    class TableBorderEvent implements PdfPTableEvent {
        @Override
        public void tableLayout(PdfPTable table, float[][] widths, float[] heights, int headerRows, int rowStart, PdfContentByte[] canvases) {
            PdfContentByte canvas = canvases[PdfPTable.BASECANVAS];
            canvas.setColorStroke(new BaseColor(150, 150, 150)); // Couleur de l'ombre
            canvas.setLineWidth(2f);
            float x1 = widths[0][0] - 5;
            float x2 = widths[0][widths[0].length - 1] + 5;
            float y1 = heights[0] + 5;
            float y2 = heights[heights.length - 1] - 5;
            canvas.roundRectangle(x1, y2, x2 - x1, y1 - y2, 5); // Coins arrondis
            canvas.stroke();
        }
    }

    // Classe pour les en-têtes/pieds de page
    class HeaderFooterPageEvent extends PdfPageEventHelper {
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfPTable footer = new PdfPTable(3); // 3 colonnes pour : Hôtel | Date | Page
            footer.setWidthPercentage(100);

            try {
                footer.setWidths(new float[]{3f, 3f, 1f});
                footer.getDefaultCell().setBorder(Rectangle.NO_BORDER);

                // Ajouter le nom de l'hôtel à gauche
                Font footerFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.DARK_GRAY);
                footer.addCell(new Phrase("Hôtel ESprit", footerFont));

                // Ajouter la date au centre
                String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                PdfPCell dateCell = new PdfPCell(new Phrase("Generated on: " + currentDate, footerFont));
                dateCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                dateCell.setBorder(Rectangle.NO_BORDER);
                footer.addCell(dateCell);

                // Ajouter le numéro de page à droite
                PdfPCell pageCell = new PdfPCell(new Phrase(String.format("Page %d", writer.getPageNumber()), footerFont));
                pageCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                pageCell.setBorder(Rectangle.NO_BORDER);
                footer.addCell(pageCell);

                footer.setTotalWidth(document.right() - document.left());
                footer.writeSelectedRows(0, -1, document.left(), document.bottom() + 20, writer.getDirectContent());
            } catch (DocumentException de) {
                throw new ExceptionConverter(de);
            }
        }
    }
}