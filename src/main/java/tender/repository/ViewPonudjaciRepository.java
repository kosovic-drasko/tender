package tender.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import tender.domain.ViewPonudjaci;

/**
 * Spring Data JPA repository for the ViewPonudjaci entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ViewPonudjaciRepository extends JpaRepository<ViewPonudjaci, Long>, JpaSpecificationExecutor<ViewPonudjaci> {}
