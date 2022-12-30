package tender.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tender.IntegrationTest;
import tender.domain.ViewPonudjaci;
import tender.repository.ViewPonudjaciRepository;
import tender.service.criteria.ViewPonudjaciCriteria;

/**
 * Integration tests for the {@link ViewPonudjaciResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ViewPonudjaciResourceIT {

    private static final String DEFAULT_NAZIV_PONUDJACA = "AAAAAAAAAA";
    private static final String UPDATED_NAZIV_PONUDJACA = "BBBBBBBBBB";

    private static final Integer DEFAULT_SIFRA_POSTUPKA = 1;
    private static final Integer UPDATED_SIFRA_POSTUPKA = 2;
    private static final Integer SMALLER_SIFRA_POSTUPKA = 1 - 1;

    private static final Integer DEFAULT_SIFRA_PONUDE = 1;
    private static final Integer UPDATED_SIFRA_PONUDE = 2;
    private static final Integer SMALLER_SIFRA_PONUDE = 1 - 1;

    private static final String ENTITY_API_URL = "/api/view-ponudjacis";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ViewPonudjaciRepository viewPonudjaciRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restViewPonudjaciMockMvc;

    private ViewPonudjaci viewPonudjaci;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ViewPonudjaci createEntity(EntityManager em) {
        ViewPonudjaci viewPonudjaci = new ViewPonudjaci()
            .nazivPonudjaca(DEFAULT_NAZIV_PONUDJACA)
            .sifraPostupka(DEFAULT_SIFRA_POSTUPKA)
            .sifraPonude(DEFAULT_SIFRA_PONUDE);
        return viewPonudjaci;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ViewPonudjaci createUpdatedEntity(EntityManager em) {
        ViewPonudjaci viewPonudjaci = new ViewPonudjaci()
            .nazivPonudjaca(UPDATED_NAZIV_PONUDJACA)
            .sifraPostupka(UPDATED_SIFRA_POSTUPKA)
            .sifraPonude(UPDATED_SIFRA_PONUDE);
        return viewPonudjaci;
    }

    @BeforeEach
    public void initTest() {
        viewPonudjaci = createEntity(em);
    }

    @Test
    @Transactional
    void getAllViewPonudjacis() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList
        restViewPonudjaciMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(viewPonudjaci.getId().intValue())))
            .andExpect(jsonPath("$.[*].nazivPonudjaca").value(hasItem(DEFAULT_NAZIV_PONUDJACA)))
            .andExpect(jsonPath("$.[*].sifraPostupka").value(hasItem(DEFAULT_SIFRA_POSTUPKA)))
            .andExpect(jsonPath("$.[*].sifraPonude").value(hasItem(DEFAULT_SIFRA_PONUDE)));
    }

    @Test
    @Transactional
    void getViewPonudjaci() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get the viewPonudjaci
        restViewPonudjaciMockMvc
            .perform(get(ENTITY_API_URL_ID, viewPonudjaci.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(viewPonudjaci.getId().intValue()))
            .andExpect(jsonPath("$.nazivPonudjaca").value(DEFAULT_NAZIV_PONUDJACA))
            .andExpect(jsonPath("$.sifraPostupka").value(DEFAULT_SIFRA_POSTUPKA))
            .andExpect(jsonPath("$.sifraPonude").value(DEFAULT_SIFRA_PONUDE));
    }

    @Test
    @Transactional
    void getViewPonudjacisByIdFiltering() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        Long id = viewPonudjaci.getId();

        defaultViewPonudjaciShouldBeFound("id.equals=" + id);
        defaultViewPonudjaciShouldNotBeFound("id.notEquals=" + id);

        defaultViewPonudjaciShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultViewPonudjaciShouldNotBeFound("id.greaterThan=" + id);

        defaultViewPonudjaciShouldBeFound("id.lessThanOrEqual=" + id);
        defaultViewPonudjaciShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisByNazivPonudjacaIsEqualToSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where nazivPonudjaca equals to DEFAULT_NAZIV_PONUDJACA
        defaultViewPonudjaciShouldBeFound("nazivPonudjaca.equals=" + DEFAULT_NAZIV_PONUDJACA);

        // Get all the viewPonudjaciList where nazivPonudjaca equals to UPDATED_NAZIV_PONUDJACA
        defaultViewPonudjaciShouldNotBeFound("nazivPonudjaca.equals=" + UPDATED_NAZIV_PONUDJACA);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisByNazivPonudjacaIsInShouldWork() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where nazivPonudjaca in DEFAULT_NAZIV_PONUDJACA or UPDATED_NAZIV_PONUDJACA
        defaultViewPonudjaciShouldBeFound("nazivPonudjaca.in=" + DEFAULT_NAZIV_PONUDJACA + "," + UPDATED_NAZIV_PONUDJACA);

        // Get all the viewPonudjaciList where nazivPonudjaca equals to UPDATED_NAZIV_PONUDJACA
        defaultViewPonudjaciShouldNotBeFound("nazivPonudjaca.in=" + UPDATED_NAZIV_PONUDJACA);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisByNazivPonudjacaIsNullOrNotNull() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where nazivPonudjaca is not null
        defaultViewPonudjaciShouldBeFound("nazivPonudjaca.specified=true");

        // Get all the viewPonudjaciList where nazivPonudjaca is null
        defaultViewPonudjaciShouldNotBeFound("nazivPonudjaca.specified=false");
    }

    @Test
    @Transactional
    void getAllViewPonudjacisByNazivPonudjacaContainsSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where nazivPonudjaca contains DEFAULT_NAZIV_PONUDJACA
        defaultViewPonudjaciShouldBeFound("nazivPonudjaca.contains=" + DEFAULT_NAZIV_PONUDJACA);

        // Get all the viewPonudjaciList where nazivPonudjaca contains UPDATED_NAZIV_PONUDJACA
        defaultViewPonudjaciShouldNotBeFound("nazivPonudjaca.contains=" + UPDATED_NAZIV_PONUDJACA);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisByNazivPonudjacaNotContainsSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where nazivPonudjaca does not contain DEFAULT_NAZIV_PONUDJACA
        defaultViewPonudjaciShouldNotBeFound("nazivPonudjaca.doesNotContain=" + DEFAULT_NAZIV_PONUDJACA);

        // Get all the viewPonudjaciList where nazivPonudjaca does not contain UPDATED_NAZIV_PONUDJACA
        defaultViewPonudjaciShouldBeFound("nazivPonudjaca.doesNotContain=" + UPDATED_NAZIV_PONUDJACA);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPostupkaIsEqualToSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPostupka equals to DEFAULT_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldBeFound("sifraPostupka.equals=" + DEFAULT_SIFRA_POSTUPKA);

        // Get all the viewPonudjaciList where sifraPostupka equals to UPDATED_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldNotBeFound("sifraPostupka.equals=" + UPDATED_SIFRA_POSTUPKA);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPostupkaIsInShouldWork() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPostupka in DEFAULT_SIFRA_POSTUPKA or UPDATED_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldBeFound("sifraPostupka.in=" + DEFAULT_SIFRA_POSTUPKA + "," + UPDATED_SIFRA_POSTUPKA);

        // Get all the viewPonudjaciList where sifraPostupka equals to UPDATED_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldNotBeFound("sifraPostupka.in=" + UPDATED_SIFRA_POSTUPKA);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPostupkaIsNullOrNotNull() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPostupka is not null
        defaultViewPonudjaciShouldBeFound("sifraPostupka.specified=true");

        // Get all the viewPonudjaciList where sifraPostupka is null
        defaultViewPonudjaciShouldNotBeFound("sifraPostupka.specified=false");
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPostupkaIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPostupka is greater than or equal to DEFAULT_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldBeFound("sifraPostupka.greaterThanOrEqual=" + DEFAULT_SIFRA_POSTUPKA);

        // Get all the viewPonudjaciList where sifraPostupka is greater than or equal to UPDATED_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldNotBeFound("sifraPostupka.greaterThanOrEqual=" + UPDATED_SIFRA_POSTUPKA);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPostupkaIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPostupka is less than or equal to DEFAULT_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldBeFound("sifraPostupka.lessThanOrEqual=" + DEFAULT_SIFRA_POSTUPKA);

        // Get all the viewPonudjaciList where sifraPostupka is less than or equal to SMALLER_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldNotBeFound("sifraPostupka.lessThanOrEqual=" + SMALLER_SIFRA_POSTUPKA);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPostupkaIsLessThanSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPostupka is less than DEFAULT_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldNotBeFound("sifraPostupka.lessThan=" + DEFAULT_SIFRA_POSTUPKA);

        // Get all the viewPonudjaciList where sifraPostupka is less than UPDATED_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldBeFound("sifraPostupka.lessThan=" + UPDATED_SIFRA_POSTUPKA);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPostupkaIsGreaterThanSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPostupka is greater than DEFAULT_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldNotBeFound("sifraPostupka.greaterThan=" + DEFAULT_SIFRA_POSTUPKA);

        // Get all the viewPonudjaciList where sifraPostupka is greater than SMALLER_SIFRA_POSTUPKA
        defaultViewPonudjaciShouldBeFound("sifraPostupka.greaterThan=" + SMALLER_SIFRA_POSTUPKA);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPonudeIsEqualToSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPonude equals to DEFAULT_SIFRA_PONUDE
        defaultViewPonudjaciShouldBeFound("sifraPonude.equals=" + DEFAULT_SIFRA_PONUDE);

        // Get all the viewPonudjaciList where sifraPonude equals to UPDATED_SIFRA_PONUDE
        defaultViewPonudjaciShouldNotBeFound("sifraPonude.equals=" + UPDATED_SIFRA_PONUDE);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPonudeIsInShouldWork() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPonude in DEFAULT_SIFRA_PONUDE or UPDATED_SIFRA_PONUDE
        defaultViewPonudjaciShouldBeFound("sifraPonude.in=" + DEFAULT_SIFRA_PONUDE + "," + UPDATED_SIFRA_PONUDE);

        // Get all the viewPonudjaciList where sifraPonude equals to UPDATED_SIFRA_PONUDE
        defaultViewPonudjaciShouldNotBeFound("sifraPonude.in=" + UPDATED_SIFRA_PONUDE);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPonudeIsNullOrNotNull() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPonude is not null
        defaultViewPonudjaciShouldBeFound("sifraPonude.specified=true");

        // Get all the viewPonudjaciList where sifraPonude is null
        defaultViewPonudjaciShouldNotBeFound("sifraPonude.specified=false");
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPonudeIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPonude is greater than or equal to DEFAULT_SIFRA_PONUDE
        defaultViewPonudjaciShouldBeFound("sifraPonude.greaterThanOrEqual=" + DEFAULT_SIFRA_PONUDE);

        // Get all the viewPonudjaciList where sifraPonude is greater than or equal to UPDATED_SIFRA_PONUDE
        defaultViewPonudjaciShouldNotBeFound("sifraPonude.greaterThanOrEqual=" + UPDATED_SIFRA_PONUDE);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPonudeIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPonude is less than or equal to DEFAULT_SIFRA_PONUDE
        defaultViewPonudjaciShouldBeFound("sifraPonude.lessThanOrEqual=" + DEFAULT_SIFRA_PONUDE);

        // Get all the viewPonudjaciList where sifraPonude is less than or equal to SMALLER_SIFRA_PONUDE
        defaultViewPonudjaciShouldNotBeFound("sifraPonude.lessThanOrEqual=" + SMALLER_SIFRA_PONUDE);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPonudeIsLessThanSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPonude is less than DEFAULT_SIFRA_PONUDE
        defaultViewPonudjaciShouldNotBeFound("sifraPonude.lessThan=" + DEFAULT_SIFRA_PONUDE);

        // Get all the viewPonudjaciList where sifraPonude is less than UPDATED_SIFRA_PONUDE
        defaultViewPonudjaciShouldBeFound("sifraPonude.lessThan=" + UPDATED_SIFRA_PONUDE);
    }

    @Test
    @Transactional
    void getAllViewPonudjacisBySifraPonudeIsGreaterThanSomething() throws Exception {
        // Initialize the database
        viewPonudjaciRepository.saveAndFlush(viewPonudjaci);

        // Get all the viewPonudjaciList where sifraPonude is greater than DEFAULT_SIFRA_PONUDE
        defaultViewPonudjaciShouldNotBeFound("sifraPonude.greaterThan=" + DEFAULT_SIFRA_PONUDE);

        // Get all the viewPonudjaciList where sifraPonude is greater than SMALLER_SIFRA_PONUDE
        defaultViewPonudjaciShouldBeFound("sifraPonude.greaterThan=" + SMALLER_SIFRA_PONUDE);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultViewPonudjaciShouldBeFound(String filter) throws Exception {
        restViewPonudjaciMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(viewPonudjaci.getId().intValue())))
            .andExpect(jsonPath("$.[*].nazivPonudjaca").value(hasItem(DEFAULT_NAZIV_PONUDJACA)))
            .andExpect(jsonPath("$.[*].sifraPostupka").value(hasItem(DEFAULT_SIFRA_POSTUPKA)))
            .andExpect(jsonPath("$.[*].sifraPonude").value(hasItem(DEFAULT_SIFRA_PONUDE)));

        // Check, that the count call also returns 1
        restViewPonudjaciMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultViewPonudjaciShouldNotBeFound(String filter) throws Exception {
        restViewPonudjaciMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restViewPonudjaciMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingViewPonudjaci() throws Exception {
        // Get the viewPonudjaci
        restViewPonudjaciMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }
}
