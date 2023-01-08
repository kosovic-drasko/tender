package tender.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tender.domain.*;
import tender.domain.Vrednovanje;

/**
 * Spring Data JPA repository for the Vrednovanje entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VrednovanjeRepository extends JpaRepository<Vrednovanje, Long>, JpaSpecificationExecutor<Vrednovanje> {
    @Query("select sum(p.procijenjenaVrijednost)as ukupno from Vrednovanje p where p.sifraPostupka=:sifraPostupka")
    Optional<Vrednovanje> sumProcijenjena(@Param("sifraPostupka") Integer sifraPostupka);

    @Query("select sum(p.procijenjenaVrijednost)as ukupno from Vrednovanje p")
    Optional<Vrednovanje> sumAllProcijenjena();

    @Query("select sum(p.ponudjenaVrijednost)as ukupno from Vrednovanje p where p.sifraPostupka=:sifraPostupka")
    Optional<Vrednovanje> sumPonudjena(@Param("sifraPostupka") Integer sifraPostupka);

    @Query("select sum(p.ponudjenaVrijednost)as ukupno from Vrednovanje p")
    Optional<Vrednovanje> sumAllPonudjena();

    List<Vrednovanje> findBySifraPostupka(@Param("sifraPostupka") Integer sifra);

    @Query(
        "select sum(p.ponudjenaVrijednost)as ukupno from ViewPonude p where p.sifraPostupka=:sifraPostupka and p.sifraPonude=:sifraPonude"
    )
    Optional<Vrednovanje> sumPostupkaPonude(@Param("sifraPostupka") Integer sifraPostupka, @Param("sifraPonude") Integer sifraPonude);
}
