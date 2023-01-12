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
        value = "select distinct ANY_VALUE(`id`)AS `id`,\n" +
        "                       ANY_VALUE(`sifra_postupka`)AS `sifra_postupka`,\n" +
        "                       (`sifra_ponude`) AS `sifra_ponude`,\n" +
        "                       ANY_VALUE(`broj_partije`) AS `broj_partije`,\n" +
        "                       ANY_VALUE(`naziv_proizvodjaca`) AS `naziv_proizvodjaca`,\n" +
        "                       ANY_VALUE(`zasticeni_naziv`) AS `zasticeni_naziv`,\n" +
        "                       ANY_VALUE(`ponudjena_vrijednost`) AS `ponudjena_vrijednost`,\n" +
        "                       ANY_VALUE(`rok_isporuke`) AS `rok_isporuke`,\n" +
        "                       ANY_VALUE(`jedinicna_cijena`) AS `jedinicna_cijena`,\n" +
        "                       ANY_VALUE(`karakteristika_ponude`) AS `karakteristika_ponude`,\n" +
        "                       ANY_VALUE(`naziv_ponudjaca`) AS `naziv_ponudjaca`,\n" +
        "                       ANY_VALUE(`atc`) AS `atc`,\n" +
        "                       ANY_VALUE(`karakteristika_specifikacije`) AS `karakteristika_specifikacije`,\n" +
        "                       ANY_VALUE(`trazena_kolicina`) AS `trazena_kolicina`,\n" +
        "                       ANY_VALUE(`procijenjena_vrijednost`) AS `procijenjena_vrijednost`,\n" +
        "                       ANY_VALUE(`vrsta_postupka`) AS `vrsta_postupka`,\n" +
        "                       ANY_VALUE(`bod_cijena`) AS `bod_cijena`,\n" +
        "                       ANY_VALUE(`bod_rok`) AS `bod_rok`,\n" +
        "                       ANY_VALUE(`bod_ukupno`) AS `bod_ukupno`\n" +
        "\t\t\t\t\t\t\t\t\t\t\t from view_prvorangirani\n" +
        "WHERE sifra_postupka=:sifraPostupka\n" +
        "\t\t\t\t\t\t\t\t\t\t\t GROUP BY sifra_ponude",
        nativeQuery = true
    )
    List<Prvorangirani> ponudjaciPrvorangirani(@Param("sifraPostupka") Integer sifraPostupka);
}
