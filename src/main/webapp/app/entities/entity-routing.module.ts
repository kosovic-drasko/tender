import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ponudjaci',
        data: { pageTitle: 'tenderApp.ponudjaci.home.title' },
        loadChildren: () => import('./ponudjaci/ponudjaci.module').then(m => m.PonudjaciModule),
      },
      {
        path: 'hvale-ponude',
        data: { pageTitle: 'tenderApp.hvalePonude.home.title' },
        loadChildren: () => import('./hvale-ponude/hvale-ponude.module').then(m => m.HvalePonudeModule),
      },
      {
        path: 'ponude',
        data: { pageTitle: 'tenderApp.ponude.home.title' },
        loadChildren: () => import('./ponude/ponude.module').then(m => m.PonudeModule),
      },
      {
        path: 'postupci',
        data: { pageTitle: 'tenderApp.postupci.home.title' },
        loadChildren: () => import('./postupci/postupci.module').then(m => m.PostupciModule),
      },
      {
        path: 'view-ponude',
        data: { pageTitle: 'tenderApp.viewPonude.home.title' },
        loadChildren: () => import('./view-ponude/view-ponude.module').then(m => m.ViewPonudeModule),
      },
      {
        path: 'specifikacije',
        data: { pageTitle: 'tenderApp.specifikacije.home.title' },
        loadChildren: () => import('./specifikacije/specifikacije.module').then(m => m.SpecifikacijeModule),
      },
      {
        path: 'tenderi-home',
        data: { pageTitle: 'tenderApp.tenderiHome.home.title' },
        loadChildren: () => import('./tenderi-home/tenderi-home.module').then(m => m.TenderiHomeModule),
      },
      {
        path: 'vrednovanje',
        data: { pageTitle: 'tenderApp.vrednovanje.home.title' },
        loadChildren: () => import('./vrednovanje/vrednovanje.module').then(m => m.VrednovanjeModule),
      },
      {
        path: 'prvorangirani',
        data: { pageTitle: 'tenderApp.prvorangirani.home.title' },
        loadChildren: () => import('./prvorangirani/prvorangirani.module').then(m => m.PrvorangiraniModule),
      },
      {
        path: 'view-vrednovanje',
        data: { pageTitle: 'tenderApp.viewVrednovanje.home.title' },
        loadChildren: () => import('./view-vrednovanje/view-vrednovanje.module').then(m => m.ViewVrednovanjeModule),
      },
      {
        path: 'view-prvorangirani',
        data: { pageTitle: 'tenderApp.viewPrvorangirani.home.title' },
        loadChildren: () => import('./view-prvorangirani/view-prvorangirani.module').then(m => m.ViewPrvorangiraniModule),
      },
      {
        path: 'view-ponudjaci',
        data: { pageTitle: 'tenderApp.viewPonudjaci.home.title' },
        loadChildren: () => import('./view-ponudjaci/view-ponudjaci.module').then(m => m.ViewPonudjaciModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
