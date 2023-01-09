package tender.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tender.domain.Ponude;
import tender.domain.ViewPonude;
import tender.domain.ViewPonude;

/**
 * Spring Data JPA repository for the ViewPonude entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ViewPonudeRepository extends JpaRepository<ViewPonude, Long>, JpaSpecificationExecutor<ViewPonude> {
    //    @Query(
    //        value = "select distinct ANY_VALUE(`ponude`.`id`) AS `id`,ANY_VALUE(`ponude`.`sifra_postupka`) AS `sifra_postupka`,ANY_VALUE(`ponude`.`sifra_ponude`) AS `sifra_ponude`,ANY_VALUE(`ponudjaci`.`naziv_ponudjaca`) AS `naziv_ponudjaca` from (`ponudjaci` join `ponude` on((`ponude`.`sifra_ponudjaca` = `ponudjaci`.`id`)))\n" +
    //            "where ponude.sifra_postupka=:sifra_postupka GROUP BY ponude.sifra_ponude",
    //        nativeQuery = true
    //    )
    //    List<ViewPonude> findBySifraPostupkaPonudjaci(@Param("sifra_postupka") Integer sifra_postupka);
    //
    //
    //    @Query(
    //        value = "select distinct ANY_VALUE(`ponude`.`id`) AS `id`,ANY_VALUE(`ponude`.`sifra_postupka`) AS `sifra_postupka`,ANY_VALUE(`ponude`.`sifra_ponude`) AS `sifra_ponude`,ANY_VALUE(`ponudjaci`.`naziv_ponudjaca`) AS `naziv_ponudjaca` from (`ponudjaci` join `ponude` on((`ponude`.`sifra_ponudjaca` = `ponudjaci`.`id`)))\n" +
    //            " GROUP BY ponude.sifra_ponude",
    //        nativeQuery = true
    //    )
    //    List<ViewPonude> findByPonudjaci() ;

    @Query("select p  from ViewPonude p where p.sifraPostupka=:sifraPostupka")
    Optional<ViewPonude> ponudePonudjaci(@Param("sifraPostupka") Integer sifraPostupka);

    @Query("select sum(p.ponudjenaVrijednost)as ukupno from ViewPonude p where p.sifraPostupka=:sifraPostupka")
    Optional<ViewPonude> sum(@Param("sifraPostupka") Integer sifraPostupka);

    @Query(
        "select sum(p.ponudjenaVrijednost)as ukupno from ViewPonude p where p.sifraPostupka=:sifraPostupka and p.sifraPonude=:sifraPonude"
    )
    Optional<ViewPonude> sumPostupkaPonude(@Param("sifraPostupka") Integer sifraPostupka, @Param("sifraPonude") Integer sifraPonude);
}
