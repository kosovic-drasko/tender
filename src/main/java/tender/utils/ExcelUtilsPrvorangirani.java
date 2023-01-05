package tender.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import tender.domain.Prvorangirani;

public class ExcelUtilsPrvorangirani {

    public static String EXCELTYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static ByteArrayInputStream customersToExcel(List<Prvorangirani> Prvorangirani) throws IOException {
        String[] COLUMNs = {
            "Sifra Postupka",
            "Sifra Ponude",
            "Broj Partije",
            "Naziv Proizvodjaca",
            "Zasticeni Naziv",
            "Ponudjena Vrijednost",
            "Rok Isporuka",
            "Jedinicna Cijena",
            "Karakteristike Ponude",
            "Naziv Ponudjaca",
            "atc",
            "Karakteristike Specifikacije",
            "Kolicina",
            "Procijenjena Vrijednost",
            "Vrsta Postupka",
            "Bod Cijena",
            "Bod Rok",
            "Bod Ukupno",
        };
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
            CreationHelper createHelper = workbook.getCreationHelper();

            Sheet sheet = workbook.createSheet("Prvorangirani");

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.BLACK.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);

            // Row for Header
            Row headerRow = sheet.createRow(0);

            // Header
            for (int col = 0; col < COLUMNs.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(COLUMNs[col]);
                cell.setCellStyle(headerCellStyle);
            }

            // CellStyle for Age
            CellStyle ageCellStyle = workbook.createCellStyle();
            ageCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("#"));

            int rowIdx = 1;
            for (Prvorangirani Prvorangiranis : Prvorangirani) {
                Row row = sheet.createRow(rowIdx++);

                //                row.createCell(0).setCellValue(Prvorangiranis.getId());
                row.createCell(0).setCellValue(Prvorangiranis.getSifraPostupka());
                row.createCell(1).setCellValue(Prvorangiranis.getSifraPonude());
                row.createCell(2).setCellValue(Prvorangiranis.getBrojPartije());
                row.createCell(3).setCellValue(Prvorangiranis.getNazivProizvodjaca());
                row.createCell(4).setCellValue(Prvorangiranis.getZasticeniNaziv());
                row.createCell(5).setCellValue(Prvorangiranis.getPonudjenaVrijednost());
                row.createCell(6).setCellValue(Prvorangiranis.getRokIsporuke());
                row.createCell(7).setCellValue(Prvorangiranis.getJedinicnaCijena());
                row.createCell(8).setCellValue(Prvorangiranis.getKarakteristikaPonude());
                row.createCell(9).setCellValue(Prvorangiranis.getNazivPonudjaca());
                row.createCell(10).setCellValue(Prvorangiranis.getAtc());
                row.createCell(11).setCellValue(Prvorangiranis.getKarakteristikaSpecifikacije());
                row.createCell(12).setCellValue(Prvorangiranis.getTrazenaKolicina());
                row.createCell(13).setCellValue(Prvorangiranis.getProcijenjenaVrijednost());
                row.createCell(14).setCellValue(Prvorangiranis.getVrstaPostupka());
                row.createCell(15).setCellValue(Prvorangiranis.getBodCijena());
                row.createCell(16).setCellValue(Prvorangiranis.getBodRok());
                row.createCell(17).setCellValue(Prvorangiranis.getBodUkupno());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public static List<Prvorangirani> parseExcelFile(InputStream is) {
        try {
            Workbook workbook = new XSSFWorkbook(is);

            Sheet sheet = workbook.getSheet("Prvorangirani");
            Iterator<Row> rows = sheet.iterator();

            List<Prvorangirani> lstPrvorangirani = new ArrayList<Prvorangirani>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Iterator<Cell> cellsInRow = currentRow.iterator();

                Prvorangirani Prvorangirani = new Prvorangirani();

                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();

                    switch (cellIdx) {
                        //                        case 0:
                        //                            Prvorangirani.setId((long) currentCell.getNumericCellValue());
                        //                            break;
                        case 0:
                            Prvorangirani.setSifraPostupka((int) currentCell.getNumericCellValue());
                            break;
                        case 1:
                            Prvorangirani.setSifraPonude((int) currentCell.getNumericCellValue());
                            break;
                        case 2:
                            Prvorangirani.setBrojPartije((int) currentCell.getNumericCellValue());
                            break;
                        case 3:
                            Prvorangirani.setNazivProizvodjaca(currentCell.getStringCellValue());
                            break;
                        case 4:
                            Prvorangirani.setZasticeniNaziv(currentCell.getStringCellValue());
                            break;
                        case 5:
                            Prvorangirani.setPonudjenaVrijednost(currentCell.getNumericCellValue());
                            break;
                        case 6:
                            Prvorangirani.setRokIsporuke((int) currentCell.getNumericCellValue());
                            break;
                        case 7:
                            Prvorangirani.setJedinicnaCijena(currentCell.getNumericCellValue());
                            break;
                        case 8:
                            Prvorangirani.setKarakteristikaPonude(currentCell.getStringCellValue());
                            break;
                        case 9:
                            Prvorangirani.setNazivPonudjaca(currentCell.getStringCellValue());

                            break;
                        case 10:
                            Prvorangirani.setKarakteristikaSpecifikacije(currentCell.getStringCellValue());
                            break;
                        case 11:
                            Prvorangirani.setAtc(currentCell.getStringCellValue());
                            break;
                        case 12:
                            Prvorangirani.setTrazenaKolicina((int) currentCell.getNumericCellValue());
                            break;
                        case 13:
                            Prvorangirani.setProcijenjenaVrijednost((double) currentCell.getNumericCellValue());
                            break;
                        case 14:
                            Prvorangirani.setVrstaPostupka(currentCell.getStringCellValue());
                            break;
                        case 15:
                            Prvorangirani.setBodCijena(currentCell.getNumericCellValue());
                            break;
                        case 16:
                            Prvorangirani.setBodRok(currentCell.getNumericCellValue());
                            break;
                        case 17:
                            Prvorangirani.setBodUkupno(currentCell.getNumericCellValue());
                            break;
                        default:
                            break;
                    }

                    cellIdx++;
                }

                lstPrvorangirani.add(Prvorangirani);
            }

            // Close WorkBook
            workbook.close();

            return lstPrvorangirani;
        } catch (IOException e) {
            throw new RuntimeException("FAIL! -> message = " + e.getMessage());
        }
    }

    public static boolean isExcelFile(MultipartFile file) {
        if (!EXCELTYPE.equals(file.getContentType())) {
            return false;
        }

        return true;
    }
}
