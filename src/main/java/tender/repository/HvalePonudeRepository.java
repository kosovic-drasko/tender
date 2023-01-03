package tender.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tender.domain.HvalePonude;
import tender.domain.HvalePonude;

/**
 * Spring Data JPA repository for the HvalePonude entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HvalePonudeRepository extends JpaRepository<HvalePonude, Long>, JpaSpecificationExecutor<HvalePonude> {
    @Query("select sum(p.procijenjenaVrijednost)as ukupno from HvalePonude p where p.sifraPostupka=:sifraPostupka")
    Optional<HvalePonude> sum(@Param("sifraPostupka") Integer sifraPostupka);

    @Query("select sum(p.procijenjenaVrijednost)as ukupno from HvalePonude p")
    Optional<HvalePonude> sumAll();
}
