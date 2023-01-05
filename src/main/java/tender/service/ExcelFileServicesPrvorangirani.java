package tender.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tender.domain.Prvorangirani;
import tender.repository.PrvorangiraniRepository;
import tender.utils.ExcelUtilsPrvorangirani;

@Service
public class ExcelFileServicesPrvorangirani {

    @Autowired
    PrvorangiraniRepository prvorangiraniRepository;

    // Store File Data to Database
    public void store(MultipartFile file) {
        try {
            List<Prvorangirani> lstPrvorangirani = ExcelUtilsPrvorangirani.parseExcelFile(file.getInputStream());
            // Save Customers to DataBase
            prvorangiraniRepository.saveAll(lstPrvorangirani);
        } catch (IOException e) {
            throw new RuntimeException("FAIL! -> message = " + e.getMessage());
        }
    }

    public ByteArrayInputStream loadFile() {
        List<Prvorangirani> Prvorangirani = prvorangiraniRepository.findAll();

        try {
            ByteArrayInputStream in = ExcelUtilsPrvorangirani.customersToExcel(Prvorangirani);
            return in;
        } catch (IOException e) {}
        return null;
    }

    public ByteArrayInputStream loadPrvorangiraniExelFilePostupak(Integer sifraPostupka) {
        List<Prvorangirani> Prvorangirani = prvorangiraniRepository.findBySifraPostupka(sifraPostupka);
        try {
            ByteArrayInputStream in = ExcelUtilsPrvorangirani.customersToExcel(Prvorangirani);
            return in;
        } catch (IOException e) {}
        return null;
    }
}
