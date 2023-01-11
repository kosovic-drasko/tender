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
    //    @Query(value = "select distinct any_value(`view_prvorangirani`.`id`) as `id`,any_value(`view_prvorangirani`.`bod_cijena`) as `bod_cijena`,any_value(`view_prvorangirani`.`atc`) as `atc`,any_value(`view_prvorangirani`.`sifra_postupka`) as `sifra_postupka`,any_value(`view_prvorangirani`.`sifra_ponude`) as `sifra_view_vrednovanje`,any_value(`ponudjaci`.`naziv_ponudjaca`) as `naziv_ponudjaca`from(`ponudjaci`join `view_prvorangirani` on((`view_prvorangirani`.`naziv_ponudjaca` = `ponudjaci`.`naziv_ponudjaca`))) where view_prvorangirani.sifra_postupka=:sifraPostupka group by`view_prvorangirani`.`sifra_ponude`",nativeQuery = true)
    //    List<Vrednovanje> ponudjaci(@Param("sifraPostupka") Integer sifra);
}
