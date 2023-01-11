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

    @Query(
        value = "select distinct `ponude`.`id` AS `id`,\n" +
        "                ANY_VALUE(`ponude`.`sifra_postupka`)AS `sifra_postupka`,\n" +
        "                ANY_VALUE(`ponude`.`sifra_ponude`) AS `sifra_ponude`,\n" +
        "                ANY_VALUE(`ponude`.`broj_partije`) AS `broj_partije`,\n" +
        "                ANY_VALUE(`ponude`.`naziv_proizvodjaca`) AS `naziv_proizvodjaca`,\n" +
        "                ANY_VALUE(`ponude`.`zasticeni_naziv`) AS `zasticeni_naziv`,\n" +
        "                ANY_VALUE(`ponude`.`ponudjena_vrijednost`) AS `ponudjena_vrijednost`,\n" +
        "                ANY_VALUE(`ponude`.`rok_isporuke`) AS `rok_isporuke`,\n" +
        "                ANY_VALUE(`ponude`.`jedinicna_cijena`) AS `jedinicna_cijena`,\n" +
        "                ANY_VALUE(`ponude`.`karakteristika`) AS `karakteristika_ponude`,\n" +
        "                ANY_VALUE(`ponudjaci`.`naziv_ponudjaca`) AS `naziv_ponudjaca`,\n" +
        "                ANY_VALUE(`specifikacije`.`atc`) AS `atc`,\n" +
        "                ANY_VALUE(`specifikacije`.`karakteristika`) AS `karakteristika_specifikacije`,\n" +
        "                ANY_VALUE(`specifikacije`.`trazena_kolicina`) AS `trazena_kolicina`,\n" +
        "                ANY_VALUE(`specifikacije`.`procijenjena_vrijednost`) AS `procijenjena_vrijednost`,\n" +
        "                ANY_VALUE(`postupci`.`vrsta_postupka`) AS `vrsta_postupka`,\n" +
        "                ANY_VALUE((`postupci`.`kriterijum_cijena` * min(`ponude`.`ponudjena_vrijednost`) OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` ) ) / `ponude`.`ponudjena_vrijednost`) AS `bod_cijena`,\n" +
        "                ANY_VALUE((`postupci`.`drugi_kriterijum` * min(`ponude`.`rok_isporuke`) OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` ) ) / `ponude`.`rok_isporuke`) AS `bod_rok`,\n" +
        "                ANY_VALUE(((`postupci`.`kriterijum_cijena` * min(`ponude`.`ponudjena_vrijednost`) OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` ) ) / `ponude`.`ponudjena_vrijednost`) + ((`postupci`.`drugi_kriterijum` * min(`ponude`.`rok_isporuke`) OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` ) ) / `ponude`.`rok_isporuke`)) AS `bod_ukupno`\n" +
        "from (((`ponude` join `postupci` on((`ponude`.`sifra_postupka` = `postupci`.`sifra_postupka`))) join `ponudjaci` on((`ponude`.`sifra_ponudjaca` = `ponudjaci`.`id`))) join `specifikacije` on(((`ponude`.`sifra_postupka` = `specifikacije`.`sifra_postupka`) and (`ponude`.`broj_partije` = `specifikacije`.`broj_partije`))))\n" +
        " group by`ponude`.`sifra_ponude` ",
        nativeQuery = true
    )
    List<Prvorangirani> ponudjaciPrvorangirani();
}
