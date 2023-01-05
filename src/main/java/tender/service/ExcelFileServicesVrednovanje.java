package tender.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tender.domain.Vrednovanje;
import tender.repository.VrednovanjeRepository;
import tender.utils.ExcelUtilsVrednovanje;

@Service
public class ExcelFileServicesVrednovanje {

    @Autowired
    VrednovanjeRepository vrednovanjeRepository;

    // Store File Data to Database
    public void store(MultipartFile file) {
        try {
            List<Vrednovanje> lstVrednovanje = ExcelUtilsVrednovanje.parseExcelFile(file.getInputStream());
            // Save Customers to DataBase
            vrednovanjeRepository.saveAll(lstVrednovanje);
        } catch (IOException e) {
            throw new RuntimeException("FAIL! -> message = " + e.getMessage());
        }
    }

    public ByteArrayInputStream loadFile() {
        List<Vrednovanje> Vrednovanje = vrednovanjeRepository.findAll();

        try {
            ByteArrayInputStream in = ExcelUtilsVrednovanje.customersToExcel(Vrednovanje);
            return in;
        } catch (IOException e) {}
        return null;
    }

    public ByteArrayInputStream loadVrednovanjeExelFilePostupak(Integer sifraPostupka) {
        List<Vrednovanje> Vrednovanje = vrednovanjeRepository.findBySifraPostupka(sifraPostupka);
        try {
            ByteArrayInputStream in = ExcelUtilsVrednovanje.customersToExcel(Vrednovanje);
            return in;
        } catch (IOException e) {}
        return null;
    }
}
