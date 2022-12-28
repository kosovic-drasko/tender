package tender.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tender.domain.Ponude;

/**
 * Spring Data JPA repository for the Ponude entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PonudeRepository extends JpaRepository<Ponude, Long>, JpaSpecificationExecutor<Ponude> {
    @Query("select p from Ponude p where p.sifraPostupka=:sifraPostupka")
    List<Ponude> findBySifraPostupkaList(@Param("sifraPostupka") Integer sifraPostupka);
}
