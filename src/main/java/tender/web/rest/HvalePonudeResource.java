package tender.web.rest;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import tender.domain.HvalePonude;
import tender.repository.HvalePonudeRepository;
import tender.service.HvalePonudeQueryService;
import tender.service.HvalePonudeService;
import tender.service.criteria.HvalePonudeCriteria;

/**
 * REST controller for managing {@link tender.domain.HvalePonude}.
 */
@RestController
@RequestMapping("/api")
public class HvalePonudeResource {

    private final Logger log = LoggerFactory.getLogger(HvalePonudeResource.class);

    private final HvalePonudeService hvalePonudeService;

    private final HvalePonudeRepository hvalePonudeRepository;

    private final HvalePonudeQueryService hvalePonudeQueryService;

    public HvalePonudeResource(
        HvalePonudeService hvalePonudeService,
        HvalePonudeRepository hvalePonudeRepository,
        HvalePonudeQueryService hvalePonudeQueryService
    ) {
        this.hvalePonudeService = hvalePonudeService;
        this.hvalePonudeRepository = hvalePonudeRepository;
        this.hvalePonudeQueryService = hvalePonudeQueryService;
    }

    /**
     * {@code GET  /hvale-ponudes} : get all the hvalePonudes.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of hvalePonudes in body.
     */
    @GetMapping("/hvale-ponudes")
    public ResponseEntity<List<HvalePonude>> getAllHvalePonudes(
        HvalePonudeCriteria criteria,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get HvalePonudes by criteria: {}", criteria);
        Page<HvalePonude> page = hvalePonudeQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /hvale-ponudes/count} : count all the hvalePonudes.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/hvale-ponudes/count")
    public ResponseEntity<Long> countHvalePonudes(HvalePonudeCriteria criteria) {
        log.debug("REST request to count HvalePonudes by criteria: {}", criteria);
        return ResponseEntity.ok().body(hvalePonudeQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /hvale-ponudes/:id} : get the "id" hvalePonude.
     *
     * @param id the id of the hvalePonude to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the hvalePonude, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/hvale-ponudes/{id}")
    public ResponseEntity<HvalePonude> getHvalePonude(@PathVariable Long id) {
        log.debug("REST request to get HvalePonude : {}", id);
        Optional<HvalePonude> hvalePonude = hvalePonudeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(hvalePonude);
    }

    @GetMapping("/hvale-sum/{sifraPostupka}")
    public Optional<HvalePonude> getSumSpecifikacije(@PathVariable Integer sifraPostupka) {
        return hvalePonudeRepository.sum(sifraPostupka);
    }

    @GetMapping("/hvale-sum-all")
    public Optional<HvalePonude> getSumAllSpecifikacije() {
        return hvalePonudeRepository.sumAll();
    }
}
