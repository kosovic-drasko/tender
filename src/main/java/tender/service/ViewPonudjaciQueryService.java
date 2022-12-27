package tender.service;

import java.util.List;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;
import tender.domain.*; // for static metamodels
import tender.domain.ViewPonudjaci;
import tender.repository.ViewPonudjaciRepository;
import tender.service.criteria.ViewPonudjaciCriteria;

/**
 * Service for executing complex queries for {@link ViewPonudjaci} entities in the database.
 * The main input is a {@link ViewPonudjaciCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link ViewPonudjaci} or a {@link Page} of {@link ViewPonudjaci} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ViewPonudjaciQueryService extends QueryService<ViewPonudjaci> {

    private final Logger log = LoggerFactory.getLogger(ViewPonudjaciQueryService.class);

    private final ViewPonudjaciRepository viewPonudjaciRepository;

    public ViewPonudjaciQueryService(ViewPonudjaciRepository viewPonudjaciRepository) {
        this.viewPonudjaciRepository = viewPonudjaciRepository;
    }

    /**
     * Return a {@link List} of {@link ViewPonudjaci} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<ViewPonudjaci> findByCriteria(ViewPonudjaciCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<ViewPonudjaci> specification = createSpecification(criteria);
        return viewPonudjaciRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link ViewPonudjaci} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ViewPonudjaci> findByCriteria(ViewPonudjaciCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<ViewPonudjaci> specification = createSpecification(criteria);
        return viewPonudjaciRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ViewPonudjaciCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<ViewPonudjaci> specification = createSpecification(criteria);
        return viewPonudjaciRepository.count(specification);
    }

    /**
     * Function to convert {@link ViewPonudjaciCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<ViewPonudjaci> createSpecification(ViewPonudjaciCriteria criteria) {
        Specification<ViewPonudjaci> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), ViewPonudjaci_.id));
            }
            if (criteria.getNazivPonudjaca() != null) {
                specification = specification.and(buildStringSpecification(criteria.getNazivPonudjaca(), ViewPonudjaci_.nazivPonudjaca));
            }
            if (criteria.getSifraPostupka() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getSifraPostupka(), ViewPonudjaci_.sifraPostupka));
            }
        }
        return specification;
    }
}
