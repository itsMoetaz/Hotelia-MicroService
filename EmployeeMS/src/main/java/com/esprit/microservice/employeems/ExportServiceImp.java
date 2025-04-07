package com.esprit.microservice.employeems;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Stream;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Map;
import java.util.stream.Collectors;
import javax.imageio.ImageIO;
import com.itextpdf.text.Rectangle;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PiePlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import com.itextpdf.text.Image;
@Service
public class ExportServiceImp {

    @Autowired
    private IEmployeeService employeeService;

    public ByteArrayResource exportEmployeesToPDF() throws Exception {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, out);

        // Add header/footer with page numbers
        writer.setPageEvent(new HeaderFooterPageEvent());

        document.open();

        // Add title
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, BaseColor.DARK_GRAY);
        Paragraph title = new Paragraph("Employee Directory", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);


        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);

        // Set column widths
        float[] columnWidths = {0.5f, 1.5f, 1.5f, 2f, 1.2f, 1.3f, 1f};
        table.setWidths(columnWidths);

        addTableHeader(table);
        addEmployeeRows(table);
// Add charts section title
        Font sectionFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.DARK_GRAY);
        Paragraph chartsTitle = new Paragraph("Employee Analytics", sectionFont);
        chartsTitle.setAlignment(Element.ALIGN_CENTER);
        chartsTitle.setSpacingBefore(30);
        chartsTitle.setSpacingAfter(15);
        document.add(chartsTitle);

        // Add charts in a side-by-side layout
        PdfPTable chartsTable = new PdfPTable(2);
        chartsTable.setWidthPercentage(100);

        // Generate and add pie chart
        Image pieChartImage = createPositionDistributionChart(400, 300);
        PdfPCell pieCell = new PdfPCell(pieChartImage);
        pieCell.setBorder(Rectangle.NO_BORDER);
        pieCell.setPadding(5);
        chartsTable.addCell(pieCell);

        // Generate and add line chart
        Image lineChartImage = createRatingByPositionChart(400, 300);
        PdfPCell lineCell = new PdfPCell(lineChartImage);
        lineCell.setBorder(Rectangle.NO_BORDER);
        lineCell.setPadding(5);
        chartsTable.addCell(lineCell);
        document.add(table);

        document.add(chartsTable);

        document.close();

        return new ByteArrayResource(out.toByteArray());
    }
    private Image createPositionDistributionChart(int width, int height) throws Exception {
        // Create dataset for pie chart
        DefaultPieDataset dataset = new DefaultPieDataset();

        // Count employees by position
        Map<Position, Long> positionCounts = employeeService.getAllEmployees().stream()
                .filter(e -> e.getPosition() != null)
                .collect(Collectors.groupingBy(Employee::getPosition, Collectors.counting()));

        // Add data to dataset
        positionCounts.forEach((position, count) -> dataset.setValue(position.toString(), count));

        // Create pie chart
        JFreeChart chart = ChartFactory.createPieChart(
                "Employee Distribution by Position",
                dataset,
                true,  // include legend
                true,  // show tooltips
                false  // no URLs
        );

        // Customize appearance
        PiePlot plot = (PiePlot) chart.getPlot();
        plot.setOutlineVisible(false);
        plot.setBackgroundPaint(Color.WHITE);
        plot.setShadowPaint(null);

        // Convert to iText Image
        BufferedImage bufferedImage = chart.createBufferedImage(width, height);
        ByteArrayOutputStream chartOut = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", chartOut);
        Image chartImage = Image.getInstance(chartOut.toByteArray());

        return chartImage;
    }

    private Image createRatingByPositionChart(int width, int height) throws Exception {
        // Create dataset for line chart
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        // Calculate average rating by position
        Map<Position, Double> avgRatingByPosition = employeeService.getAllEmployees().stream()
                .filter(e -> e.getPosition() != null && e.getPerformanceRating() != null)
                .collect(Collectors.groupingBy(
                        Employee::getPosition,
                        Collectors.averagingDouble(Employee::getPerformanceRating)
                ));

        // Add data to dataset
        avgRatingByPosition.forEach((position, avgRating) ->
                dataset.addValue(avgRating, "Average Rating", position.toString()));

        // Create line chart
        JFreeChart chart = ChartFactory.createLineChart(
                "Average Performance Rating by Position",
                "Position",
                "Rating",
                dataset,
                PlotOrientation.VERTICAL,
                true,  // include legend
                true,  // show tooltips
                false  // no URLs
        );

        // Customize appearance
        chart.setBackgroundPaint(Color.WHITE);

        // Convert to iText Image
        BufferedImage bufferedImage = chart.createBufferedImage(width, height);
        ByteArrayOutputStream chartOut = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", chartOut);
        Image chartImage = Image.getInstance(chartOut.toByteArray());

        return chartImage;
    }
    private void addTableHeader(PdfPTable table) {
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);

        Stream.of("ID", "First Name", "Last Name", "Email", "Position", "Status", "Rating")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setBackgroundColor(new BaseColor(66, 133, 244));
                    header.setBorderWidth(2);
                    header.setPaddingTop(8);
                    header.setPaddingBottom(8);
                    header.setHorizontalAlignment(Element.ALIGN_CENTER);
                    header.setPhrase(new Phrase(columnTitle, headerFont));
                    table.addCell(header);
                });
    }

    private void addEmployeeRows(PdfPTable table) {
        List<Employee> employees = employeeService.getAllEmployees();

        Font cellFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
        Font altFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);

        boolean alternate = false;

        for (Employee employee : employees) {
            BaseColor backgroundColor = alternate ?
                    new BaseColor(240, 240, 240) : BaseColor.WHITE;

            addCell(table, String.valueOf(employee.getId()), backgroundColor, cellFont);
            addCell(table, employee.getFirstName(), backgroundColor, cellFont);
            addCell(table, employee.getLastName(), backgroundColor, cellFont);
            addCell(table, employee.getEmail(), backgroundColor, cellFont);
            addCell(table, employee.getPosition() != null ?
                    employee.getPosition().toString() : "", backgroundColor, cellFont);
            addCell(table, employee.getStatus() != null ?
                    employee.getStatus().toString() : "", backgroundColor, cellFont);
            addCell(table, employee.getPerformanceRating() != null ?
                    String.format("%.1f", employee.getPerformanceRating()) : "", backgroundColor, cellFont);

            alternate = !alternate;
        }
    }

    private void addCell(PdfPTable table, String text, BaseColor backgroundColor, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPaddingTop(5);
        cell.setPaddingBottom(5);
        cell.setBorderColor(BaseColor.LIGHT_GRAY);
        cell.setBackgroundColor(backgroundColor);
        table.addCell(cell);
    }

    // Header/Footer class for page numbers
    class HeaderFooterPageEvent extends PdfPageEventHelper {
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfPTable footer = new PdfPTable(2);
            footer.setWidthPercentage(100);

            try {
                footer.setWidths(new float[] {5f, 1f});
                footer.getDefaultCell().setBorder(Rectangle.NO_BORDER);

                // Add company name on left
                footer.addCell(new Phrase("My Company HR Department",
                        new Font(Font.FontFamily.HELVETICA, 8)));

                // Add page number on right
                PdfPCell cell = new PdfPCell(new Phrase(String.format("Page %d",
                        writer.getPageNumber()), new Font(Font.FontFamily.HELVETICA, 8)));
                cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                cell.setBorder(Rectangle.NO_BORDER);
                footer.addCell(cell);

                footer.setTotalWidth(document.right() - document.left());
                footer.writeSelectedRows(0, -1, document.left(), document.bottom() + 20,
                        writer.getDirectContent());
            } catch (DocumentException de) {
                throw new ExceptionConverter(de);
            }
        }
    }
}