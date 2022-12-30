create  view view_maximalni_bod as
select `view_vrednovanje`.`broj_partije`    AS `broj_partije`,
`view_vrednovanje`.`sifra_postupka`  AS `sifra_postupka`,
max(`view_vrednovanje`.`bod_ukupno`) AS `maximalni_bod`
from `view_vrednovanje`
group by `view_vrednovanje`.`broj_partije`, `view_vrednovanje`.`sifra_postupka`
order by `view_vrednovanje`.`broj_partije`;

create  view view_ponude as
select `ponude`.`id`                   AS `id`,
`ponude`.`sifra_postupka`       AS `sifra_postupka`,
`ponude`.`sifra_ponude`         AS `sifra_ponude`,
`ponude`.`broj_partije`         AS `broj_partije`,
`ponude`.`naziv_proizvodjaca`   AS `naziv_proizvodjaca`,
`ponude`.`zasticeni_naziv`      AS `zasticeni_naziv`,
`ponude`.`ponudjena_vrijednost` AS `ponudjena_vrijednost`,
`ponude`.`rok_isporuke`         AS `rok_isporuke`,
`ponude`.`jedinicna_cijena`     AS `jedinicna_cijena`,
`ponude`.`selected`             AS `selected`,
`ponude`.`sifra_ponudjaca`      AS `sifra_ponudjaca`,
`ponude`.`karakteristika`       AS `karakteristika`,
`ponudjaci`.`naziv_ponudjaca`   AS `naziv_ponudjaca`
from (`ponude` join `ponudjaci`
on ((`ponude`.`sifra_ponudjaca` = `ponudjaci`.`id`)));

create  view view_prvorangirani as
select `view_vrednovanje`.`id`                           AS `id`,
`view_vrednovanje`.`sifra_postupka`               AS `sifra_postupka`,
`view_vrednovanje`.`naziv_ponudjaca`              AS `naziv_ponudjaca`,
`view_vrednovanje`.`sifra_ponude`                 AS `sifra_ponude`,
`view_vrednovanje`.`broj_partije`                 AS `broj_partije`,
`view_vrednovanje`.`atc`                          AS `atc`,
`view_vrednovanje`.`trazena_kolicina`             AS `trazena_kolicina`,
`view_vrednovanje`.`procijenjena_vrijednost`      AS `procijenjena_vrijednost`,
`view_vrednovanje`.`naziv_proizvodjaca`           AS `naziv_proizvodjaca`,
`view_vrednovanje`.`zasticeni_naziv`              AS `zasticeni_naziv`,
`view_vrednovanje`.`karakteristika_ponude`        AS `karakteristika_ponude`,
`view_vrednovanje`.`karakteristika_specifikacije` AS `karakteristika_specifikacije`,
`view_vrednovanje`.`jedinicna_cijena`             AS `jedinicna_cijena`,
`view_vrednovanje`.`ponudjena_vrijednost`         AS `ponudjena_vrijednost`,
`view_vrednovanje`.`rok_isporuke`                 AS `rok_isporuke`,
`view_vrednovanje`.`vrsta_postupka`               AS `vrsta_postupka`,
`view_vrednovanje`.`bod_cijena`                   AS `bod_cijena`,
`view_vrednovanje`.`bod_rok`                      AS `bod_rok`,
`view_vrednovanje`.`bod_ukupno`                   AS `bod_ukupno`
from (`view_vrednovanje` join `view_maximalni_bod`
on (((`view_vrednovanje`.`broj_partije` = `view_maximalni_bod`.`broj_partije`) and
(`view_vrednovanje`.`sifra_postupka` = `view_maximalni_bod`.`sifra_postupka`) and
(`view_vrednovanje`.`bod_ukupno` = `view_maximalni_bod`.`maximalni_bod`))));

create  view view_vrednovanje as
select distinct `ponude`.`id`                                                            AS `id`,
`ponude`.`sifra_postupka`                                                AS `sifra_postupka`,
`ponude`.`sifra_ponude`                                                  AS `sifra_ponude`,
`ponude`.`broj_partije`                                                  AS `broj_partije`,
`ponude`.`naziv_proizvodjaca`                                            AS `naziv_proizvodjaca`,
`ponude`.`zasticeni_naziv`                                               AS `zasticeni_naziv`,
`ponude`.`ponudjena_vrijednost`                                          AS `ponudjena_vrijednost`,
`ponude`.`rok_isporuke`                                                  AS `rok_isporuke`,
`ponude`.`jedinicna_cijena`                                              AS `jedinicna_cijena`,
`ponude`.`karakteristika`                                                AS `karakteristika_ponude`,
`ponudjaci`.`naziv_ponudjaca`                                            AS `naziv_ponudjaca`,
`specifikacije`.`atc`                                                    AS `atc`,
`specifikacije`.`karakteristika`                                         AS `karakteristika_specifikacije`,
`specifikacije`.`trazena_kolicina`                                       AS `trazena_kolicina`,
`specifikacije`.`procijenjena_vrijednost`                                AS `procijenjena_vrijednost`,
`postupci`.`vrsta_postupka`                                              AS `vrsta_postupka`,
((`postupci`.`kriterijum_cijena` * min(`ponude`.`ponudjena_vrijednost`)
OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` )) /
`ponude`.`ponudjena_vrijednost`)                                        AS `bod_cijena`,
((`postupci`.`drugi_kriterijum` * min(`ponude`.`rok_isporuke`)
OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` )) /
`ponude`.`rok_isporuke`)                                                AS `bod_rok`,
(((`postupci`.`kriterijum_cijena` * min(`ponude`.`ponudjena_vrijednost`)
OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` )) /
`ponude`.`ponudjena_vrijednost`) + ((`postupci`.`drugi_kriterijum` *
min(`ponude`.`rok_isporuke`)
OVER (PARTITION BY `ponude`.`broj_partije`,`ponude`.`sifra_postupka` )) /
`ponude`.`rok_isporuke`)) AS `bod_ukupno`
from (((`ponude` join `postupci`
on ((`ponude`.`sifra_postupka` = `postupci`.`sifra_postupka`))) join `ponudjaci`
on ((`ponude`.`sifra_ponudjaca` = `ponudjaci`.`id`))) join `specifikacije`
on (((`ponude`.`sifra_postupka` = `specifikacije`.`sifra_postupka`) and
(`ponude`.`broj_partije` = `specifikacije`.`broj_partije`))));

create view view_hvale_ponude as
select `specifikacije`.`id`                        AS `id`,
`specifikacije`.`broj_partije`              AS `broj_partije`,
`specifikacije`.`inn`                       AS `inn`,
`specifikacije`.`farmaceutski_oblik_lijeka` AS `farmaceutski_oblik_lijeka`,
`specifikacije`.`pakovanje`                 AS `pakovanje`,
`specifikacije`.`trazena_kolicina`          AS `trazena_kolicina`,
`specifikacije`.`procijenjena_vrijednost`   AS `procijenjena_vrijednost`,
`specifikacije`.`sifra_postupka`            AS `sifra_postupka`
from `specifikacije`
where `specifikacije`.`broj_partije` in
(select `view_prvorangirani`.`broj_partije` from `view_prvorangirani`) is false;



create view view_ponudjaci as select distinct ANY_VALUE(`ponude`.`id`) AS `id`,ANY_VALUE(`ponude`.`sifra_postupka`) AS `sifra_postupka`,ANY_VALUE(`ponude`.`sifra_ponude`) AS `sifra_ponude`,ANY_VALUE(`ponudjaci`.`naziv_ponudjaca`) AS `naziv_ponudjaca` from (`ponudjaci` join `ponude` on((`ponude`.`sifra_ponudjaca` = `ponudjaci`.`id`)))
GROUP BY ponude.sifra_ponude
