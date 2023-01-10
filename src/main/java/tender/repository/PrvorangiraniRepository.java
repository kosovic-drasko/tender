package tender.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tender.domain.*;
import tender.domain.Prvorangirani;
import tender.domain.Prvorangirani;

/**
 * Spring Data JPA repository for the Prvorangirani entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PrvorangiraniRepository extends JpaRepository<Prvorangirani, Long>, JpaSpecificationExecutor<Prvorangirani> {
    @Query("select sum(p.ponudjenaVrijednost)as ukupno from Prvorangirani p where p.sifraPostupka=:sifraPostupka")
    Optional<Prvorangirani> sumPonudjenaPrvorangorani(@Param("sifraPostupka") Integer sifraPostupka);

    @Query("select sum(p.procijenjenaVrijednost)as ukupno from Prvorangirani p where p.sifraPostupka=:sifraPostupka")
    Optional<Prvorangirani> sumProcijenjenaPrvorangorani(@Param("sifraPostupka") Integer sifraPostupka);

    @Query(
        "select sum(p.ponudjenaVrijednost)as ukupno from Prvorangirani p where p.sifraPostupka=:sifraPostupka and p.sifraPonude=:sifraPonude"
    )
    Optional<Prvorangirani> sumPostupkaPonudePrvorangiraniPonudjena(
        @Param("sifraPostupka") Integer sifraPostupka,
        @Param("sifraPonude") Integer sifraPonude
    );

    @Query(
        "select sum(p.procijenjenaVrijednost)as ukupno from Prvorangirani p where p.sifraPostupka=:sifraPostupka and p.sifraPonude=:sifraPonude"
    )
    Optional<Prvorangirani> sumPostupkaPonudePrvorangiraniProcijenjena(
        @Param("sifraPostupka") Integer sifraPostupka,
        @Param("sifraPonude") Integer sifraPonude
    );

    List<Prvorangirani> findBySifraPostupka(@Param("sifraPostupka") Integer sifra);

    @Query(
        "select sum(p.ponudjenaVrijednost)as ukupno from ViewPonude p where p.sifraPostupka=:sifraPostupka and p.sifraPonude=:sifraPonude"
    )
    Optional<Prvorangirani> sumPostupkaPonude(@Param("sifraPostupka") Integer sifraPostupka, @Param("sifraPonude") Integer sifraPonude);
}
