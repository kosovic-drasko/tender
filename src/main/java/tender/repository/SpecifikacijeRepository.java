package tender.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tender.domain.Ponude;
import tender.domain.Specifikacije;

/**
 * Spring Data JPA repository for the Specifikacije entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SpecifikacijeRepository extends JpaRepository<Specifikacije, Long>, JpaSpecificationExecutor<Specifikacije> {
    List<Specifikacije> findBySifraPostupka(@Param("sifraPostupka") Integer sifra);

    @Query("select sum(p.procijenjenaVrijednost)as ukupno from Specifikacije p where p.sifraPostupka=:sifraPostupka")
    Optional<Specifikacije> sum(@Param("sifraPostupka") Integer sifraPostupka);

    @Query("select sum(p.procijenjenaVrijednost)as ukupno from Specifikacije p")
    Optional<Specifikacije> sumAll();
}
