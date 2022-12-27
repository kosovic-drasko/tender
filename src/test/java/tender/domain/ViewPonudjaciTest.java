package tender.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import tender.web.rest.TestUtil;

class ViewPonudjaciTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ViewPonudjaci.class);
        ViewPonudjaci viewPonudjaci1 = new ViewPonudjaci();
        viewPonudjaci1.setId(1L);
        ViewPonudjaci viewPonudjaci2 = new ViewPonudjaci();
        viewPonudjaci2.setId(viewPonudjaci1.getId());
        assertThat(viewPonudjaci1).isEqualTo(viewPonudjaci2);
        viewPonudjaci2.setId(2L);
        assertThat(viewPonudjaci1).isNotEqualTo(viewPonudjaci2);
        viewPonudjaci1.setId(null);
        assertThat(viewPonudjaci1).isNotEqualTo(viewPonudjaci2);
    }
}
