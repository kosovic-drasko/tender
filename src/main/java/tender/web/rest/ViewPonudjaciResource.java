package tender.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import tender.domain.ViewPonudjaci;
import tender.repository.ViewPonudjaciRepository;
import tender.service.ViewPonudjaciQueryService;
import tender.service.ViewPonudjaciService;
import tender.service.criteria.ViewPonudjaciCriteria;
import tender.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link tender.domain.ViewPonudjaci}.
 */
@RestController
@RequestMapping("/api")
public class ViewPonudjaciResource {

    private final Logger log = LoggerFactory.getLogger(ViewPonudjaciResource.class);

    private final ViewPonudjaciService viewPonudjaciService;

    private final ViewPonudjaciRepository viewPonudjaciRepository;

    private final ViewPonudjaciQueryService viewPonudjaciQueryService;

    public ViewPonudjaciResource(
        ViewPonudjaciService viewPonudjaciService,
        ViewPonudjaciRepository viewPonudjaciRepository,
        ViewPonudjaciQueryService viewPonudjaciQueryService
    ) {
        this.viewPonudjaciService = viewPonudjaciService;
        this.viewPonudjaciRepository = viewPonudjaciRepository;
        this.viewPonudjaciQueryService = viewPonudjaciQueryService;
    }

    /**
     * {@code GET  /view-ponudjacis} : get all the viewPonudjacis.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of viewPonudjacis in body.
     */
    @GetMapping("/view-ponudjacis")
    public ResponseEntity<List<ViewPonudjaci>> getAllViewPonudjacis(
        ViewPonudjaciCriteria criteria,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get ViewPonudjacis by criteria: {}", criteria);
        Page<ViewPonudjaci> page = viewPonudjaciQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /view-ponudjacis/count} : count all the viewPonudjacis.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/view-ponudjacis/count")
    public ResponseEntity<Long> countViewPonudjacis(ViewPonudjaciCriteria criteria) {
        log.debug("REST request to count ViewPonudjacis by criteria: {}", criteria);
        return ResponseEntity.ok().body(viewPonudjaciQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /view-ponudjacis/:id} : get the "id" viewPonudjaci.
     *
     * @param id the id of the viewPonudjaci to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the viewPonudjaci, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/view-ponudjacis/{id}")
    public ResponseEntity<ViewPonudjaci> getViewPonudjaci(@PathVariable Long id) {
        log.debug("REST request to get ViewPonudjaci : {}", id);
        Optional<ViewPonudjaci> viewPonudjaci = viewPonudjaciService.findOne(id);
        return ResponseUtil.wrapOrNotFound(viewPonudjaci);
    }
}
