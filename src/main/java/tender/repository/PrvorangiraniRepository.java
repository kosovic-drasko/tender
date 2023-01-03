package tender.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tender.domain.Prvorangirani;
import tender.domain.Prvorangirani;
import tender.domain.Vrednovanje;

/**
 * Spring Data JPA repository for the Prvorangirani entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PrvorangiraniRepository extends JpaRepository<Prvorangirani, Long>, JpaSpecificationExecutor<Prvorangirani> {
    @Query("select sum(p.procijenjenaVrijednost)as ukupno from Prvorangirani p")
    Optional<Prvorangirani> sumAllProcijenjena();

    @Query("select sum(p.ponudjenaVrijednost)as ukupno from Prvorangirani p where p.sifraPostupka=:sifraPostupka")
    Optional<Prvorangirani> sumPonudjena(@Param("sifraPostupka") Integer sifraPostupka);

    @Query("select sum(p.procijenjenaVrijednost)as ukupno from Prvorangirani p where p.sifraPostupka=:sifraPostupka")
    Optional<Prvorangirani> sumProcijenjena(@Param("sifraPostupka") Integer sifraPostupka);

    @Query("select sum(p.ponudjenaVrijednost)as ukupno from Prvorangirani p")
    Optional<Prvorangirani> sumAllPonudjena();
}
