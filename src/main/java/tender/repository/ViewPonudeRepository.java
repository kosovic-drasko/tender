package tender.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tender.domain.Ponude;
import tender.domain.ViewPonude;

/**
 * Spring Data JPA repository for the ViewPonude entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ViewPonudeRepository extends JpaRepository<ViewPonude, Long>, JpaSpecificationExecutor<ViewPonude> {
    @Query(
        value = "select ANY_VALUE(view_ponude.id) as id,ANY_VALUE(view_ponude.broj_partije) as broj_partije, ANY_VALUE(view_ponude.naziv_ponudjaca) as naziv_ponudjaca\n" +
        "from view_ponude\n" +
        "where view_ponude.sifra_postupka=:sifra_postupka\n" +
        "GROUP BY view_ponude.naziv_ponudjaca",
        nativeQuery = true
    )
    List<ViewPonude> findBySifraPostupkaPonudjaci(@Param("sifra_postupka") Integer sifra_postupka);
}
