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
import tender.domain.Vrednovanje;

public class ExcelUtilsVrednovanje {

    public static String EXCELTYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static ByteArrayInputStream customersToExcel(List<Vrednovanje> vrednovanje) throws IOException {
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

            Sheet sheet = workbook.createSheet("Vrednovanje");

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
            for (Vrednovanje vrednovanjes : vrednovanje) {
                Row row = sheet.createRow(rowIdx++);

                //                row.createCell(0).setCellValue(vrednovanjes.getId());
                row.createCell(0).setCellValue(vrednovanjes.getSifraPostupka());
                row.createCell(1).setCellValue(vrednovanjes.getSifraPonude());
                row.createCell(2).setCellValue(vrednovanjes.getBrojPartije());
                row.createCell(3).setCellValue(vrednovanjes.getNazivProizvodjaca());
                row.createCell(4).setCellValue(vrednovanjes.getZasticeniNaziv());
                row.createCell(5).setCellValue(vrednovanjes.getPonudjenaVrijednost());
                row.createCell(6).setCellValue(vrednovanjes.getRokIsporuke());
                row.createCell(7).setCellValue(vrednovanjes.getJedinicnaCijena());
                row.createCell(8).setCellValue(vrednovanjes.getKarakteristikaPonude());
                row.createCell(9).setCellValue(vrednovanjes.getNazivPonudjaca());
                row.createCell(10).setCellValue(vrednovanjes.getAtc());
                row.createCell(11).setCellValue(vrednovanjes.getKarakteristikaSpecifikacije());
                row.createCell(12).setCellValue(vrednovanjes.getTrazenaKolicina());
                row.createCell(13).setCellValue(vrednovanjes.getProcijenjenaVrijednost());
                row.createCell(14).setCellValue(vrednovanjes.getVrstaPostupka());
                row.createCell(15).setCellValue(vrednovanjes.getBodCijena());
                row.createCell(16).setCellValue(vrednovanjes.getBodRok());
                row.createCell(17).setCellValue(vrednovanjes.getBodUkupno());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public static List<Vrednovanje> parseExcelFile(InputStream is) {
        try {
            Workbook workbook = new XSSFWorkbook(is);

            Sheet sheet = workbook.getSheet("Specifikacije");
            Iterator<Row> rows = sheet.iterator();

            List<Vrednovanje> lstVrednovanje = new ArrayList<Vrednovanje>();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();

                // skip header
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                Iterator<Cell> cellsInRow = currentRow.iterator();

                Vrednovanje vrednovanje = new Vrednovanje();

                int cellIdx = 0;
                while (cellsInRow.hasNext()) {
                    Cell currentCell = cellsInRow.next();

                    switch (cellIdx) {
                        //                        case 0:
                        //                            vrednovanje.setId((long) currentCell.getNumericCellValue());
                        //                            break;
                        case 0:
                            vrednovanje.setSifraPostupka((int) currentCell.getNumericCellValue());
                            break;
                        case 1:
                            vrednovanje.setSifraPonude((int) currentCell.getNumericCellValue());
                            break;
                        case 2:
                            vrednovanje.setBrojPartije((int) currentCell.getNumericCellValue());
                            break;
                        case 3:
                            vrednovanje.setNazivProizvodjaca(currentCell.getStringCellValue());
                            break;
                        case 4:
                            vrednovanje.setZasticeniNaziv(currentCell.getStringCellValue());
                            break;
                        case 5:
                            vrednovanje.setPonudjenaVrijednost(currentCell.getNumericCellValue());
                            break;
                        case 6:
                            vrednovanje.setRokIsporuke((int) currentCell.getNumericCellValue());
                            break;
                        case 7:
                            vrednovanje.setJedinicnaCijena(currentCell.getNumericCellValue());
                            break;
                        case 8:
                            vrednovanje.setKarakteristikaPonude(currentCell.getStringCellValue());
                            break;
                        case 9:
                            vrednovanje.setNazivPonudjaca(currentCell.getStringCellValue());

                            break;
                        case 10:
                            vrednovanje.setKarakteristikaSpecifikacije(currentCell.getStringCellValue());
                            break;
                        case 11:
                            vrednovanje.setAtc(currentCell.getStringCellValue());
                            break;
                        case 12:
                            vrednovanje.setTrazenaKolicina((int) currentCell.getNumericCellValue());
                            break;
                        case 13:
                            vrednovanje.setProcijenjenaVrijednost((double) currentCell.getNumericCellValue());
                            break;
                        case 14:
                            vrednovanje.setVrstaPostupka(currentCell.getStringCellValue());
                            break;
                        case 15:
                            vrednovanje.setBodCijena(currentCell.getNumericCellValue());
                            break;
                        case 16:
                            vrednovanje.setBodRok(currentCell.getNumericCellValue());
                            break;
                        case 17:
                            vrednovanje.setBodUkupno(currentCell.getNumericCellValue());
                            break;
                        default:
                            break;
                    }

                    cellIdx++;
                }

                lstVrednovanje.add(vrednovanje);
            }

            // Close WorkBook
            workbook.close();

            return lstVrednovanje;
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
