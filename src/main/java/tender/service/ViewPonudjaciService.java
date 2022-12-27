package tender.service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tender.domain.ViewPonudjaci;
import tender.repository.ViewPonudjaciRepository;

/**
 * Service Implementation for managing {@link ViewPonudjaci}.
 */
@Service
@Transactional
public class ViewPonudjaciService {

    private final Logger log = LoggerFactory.getLogger(ViewPonudjaciService.class);

    private final ViewPonudjaciRepository viewPonudjaciRepository;

    public ViewPonudjaciService(ViewPonudjaciRepository viewPonudjaciRepository) {
        this.viewPonudjaciRepository = viewPonudjaciRepository;
    }

    /**
     * Save a viewPonudjaci.
     *
     * @param viewPonudjaci the entity to save.
     * @return the persisted entity.
     */
    public ViewPonudjaci save(ViewPonudjaci viewPonudjaci) {
        log.debug("Request to save ViewPonudjaci : {}", viewPonudjaci);
        return viewPonudjaciRepository.save(viewPonudjaci);
    }

    /**
     * Update a viewPonudjaci.
     *
     * @param viewPonudjaci the entity to save.
     * @return the persisted entity.
     */
    public ViewPonudjaci update(ViewPonudjaci viewPonudjaci) {
        log.debug("Request to update ViewPonudjaci : {}", viewPonudjaci);
        return viewPonudjaciRepository.save(viewPonudjaci);
    }

    /**
     * Partially update a viewPonudjaci.
     *
     * @param viewPonudjaci the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ViewPonudjaci> partialUpdate(ViewPonudjaci viewPonudjaci) {
        log.debug("Request to partially update ViewPonudjaci : {}", viewPonudjaci);

        return viewPonudjaciRepository
            .findById(viewPonudjaci.getId())
            .map(existingViewPonudjaci -> {
                if (viewPonudjaci.getNazivPonudjaca() != null) {
                    existingViewPonudjaci.setNazivPonudjaca(viewPonudjaci.getNazivPonudjaca());
                }
                if (viewPonudjaci.getSifraPostupka() != null) {
                    existingViewPonudjaci.setSifraPostupka(viewPonudjaci.getSifraPostupka());
                }

                return existingViewPonudjaci;
            })
            .map(viewPonudjaciRepository::save);
    }

    /**
     * Get all the viewPonudjacis.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ViewPonudjaci> findAll(Pageable pageable) {
        log.debug("Request to get all ViewPonudjacis");
        return viewPonudjaciRepository.findAll(pageable);
    }

    /**
     * Get one viewPonudjaci by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ViewPonudjaci> findOne(Long id) {
        log.debug("Request to get ViewPonudjaci : {}", id);
        return viewPonudjaciRepository.findById(id);
    }

    /**
     * Delete the viewPonudjaci by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ViewPonudjaci : {}", id);
        viewPonudjaciRepository.deleteById(id);
    }
}
