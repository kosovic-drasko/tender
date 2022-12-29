create view view_vrednovanje as
select distinct `ponude`.`id` AS `id`,
ANY_VALUE(`ponude`.`sifra_postupka`)AS `sifra_postupka`,
ANY_VALUE(`ponude`.`sifra_ponude`) AS `sifra_ponude`,
ANY_VALUE(`ponude`.`broj_partije`) AS `broj_partije`,
ANY_VALUE(`ponude`.`naziv_proizvodjaca`) AS `naziv_proizvodjaca`,
ANY_VALUE(`ponude`.`zasticeni_naziv`) AS `zasticeni_naziv`,
ANY_VALUE(`ponude`.`ponudjena_vrijednost`) AS `ponudjena_vrijednost`,
ANY_VALUE(`ponude`.`rok_isporuke`) AS `rok_isporuke`,
ANY_VALUE(`ponude`.`jedinicna_cijena`) AS `jedinicna_cijena`,
ANY_VALUE(`ponude`.`karakteristika`) AS `karakteristika_ponude`,
ANY_VALUE(`ponudjaci`.`naziv_ponudjaca`) AS `naziv_ponudjaca`,
ANY_VALUE(`specifikacije`.`atc`) AS `atc`,
ANY_VALUE(`specifikacije`.`karakteristika`) AS `karakteristika_specifikacije`,
ANY_VALUE(`specifikacije`.`trazena_kolicina`) AS `trazena_kolicina`,
ANY_VALUE(`specifikacije`.`procijenjena_vrijednost`) AS `procijenjena_vrijednost`,
ANY_VALUE(`postupci`.`vrsta_postupka`) AS `vrsta_postupka`,
ANY_VALUE((`postupci`.`kriterijum_cijena` * min(`ponude`.`ponudjena_vrijednost`) OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` ) ) / `ponude`.`ponudjena_vrijednost`) AS `bod_cijena`,
ANY_VALUE((`postupci`.`drugi_kriterijum` * min(`ponude`.`rok_isporuke`) OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` ) ) / `ponude`.`rok_isporuke`) AS `bod_rok`,
ANY_VALUE(((`postupci`.`kriterijum_cijena` * min(`ponude`.`ponudjena_vrijednost`) OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` ) ) / `ponude`.`ponudjena_vrijednost`) + ((`postupci`.`drugi_kriterijum` * min(`ponude`.`rok_isporuke`) OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` ) ) / `ponude`.`rok_isporuke`)) AS `bod_ukupno`
from (((`ponude` join `postupci` on((`ponude`.`sifra_postupka` = `postupci`.`sifra_postupka`))) join `ponudjaci` on((`ponude`.`sifra_ponudjaca` = `ponudjaci`.`id`))) join `specifikacije` on(((`ponude`.`sifra_postupka` = `specifikacije`.`sifra_postupka`) and (`ponude`.`broj_partije` = `specifikacije`.`broj_partije`))))
GROUP BY PONUDE.id
