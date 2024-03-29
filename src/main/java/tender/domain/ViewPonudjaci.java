package tender.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ViewPonudjaci.
 */
@Entity
@Table(name = "view_ponudjaci")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ViewPonudjaci implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "naziv_ponudjaca")
    private String nazivPonudjaca;

    @Column(name = "sifra_postupka")
    private Integer sifraPostupka;

    @Column(name = "sifra_ponude")
    private Integer sifraPonude;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ViewPonudjaci id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNazivPonudjaca() {
        return this.nazivPonudjaca;
    }

    public ViewPonudjaci nazivPonudjaca(String nazivPonudjaca) {
        this.setNazivPonudjaca(nazivPonudjaca);
        return this;
    }

    public void setNazivPonudjaca(String nazivPonudjaca) {
        this.nazivPonudjaca = nazivPonudjaca;
    }

    public Integer getSifraPostupka() {
        return this.sifraPostupka;
    }

    public ViewPonudjaci sifraPostupka(Integer sifraPostupka) {
        this.setSifraPostupka(sifraPostupka);
        return this;
    }

    public void setSifraPostupka(Integer sifraPostupka) {
        this.sifraPostupka = sifraPostupka;
    }

    public Integer getSifraPonude() {
        return this.sifraPonude;
    }

    public ViewPonudjaci sifraPonude(Integer sifraPonude) {
        this.setSifraPonude(sifraPonude);
        return this;
    }

    public void setSifraPonude(Integer sifraPonude) {
        this.sifraPonude = sifraPonude;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ViewPonudjaci)) {
            return false;
        }
        return id != null && id.equals(((ViewPonudjaci) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ViewPonudjaci{" +
            "id=" + getId() +
            ", nazivPonudjaca='" + getNazivPonudjaca() + "'" +
            ", sifraPostupka=" + getSifraPostupka() +
            ", sifraPonude=" + getSifraPonude() +
            "}";
    }
}
