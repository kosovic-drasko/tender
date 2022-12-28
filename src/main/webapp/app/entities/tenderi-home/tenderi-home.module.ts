import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TenderiHomeComponent } from './list/tenderi-home.component';
import { TenderiHomeDetailComponent } from './detail/tenderi-home-detail.component';
import { TenderiHomeRoutingModule } from './route/tenderi-home-routing.module';
import { SpecifikacijeModule } from '../specifikacije/specifikacije.module';
import { PrvorangiraniModule } from '../prvorangirani/prvorangirani.module';
import { VrednovanjeModule } from '../vrednovanje/vrednovanje.module';
import { ViewPonudeModule } from '../view-ponude/view-ponude.module';
import { HvalePonudeModule } from '../hvale-ponude/hvale-ponude.module';

@NgModule({
  imports: [
    SharedModule,
    TenderiHomeRoutingModule,
    SpecifikacijeModule,
    PrvorangiraniModule,
    VrednovanjeModule,
    ViewPonudeModule,
    HvalePonudeModule,
  ],
  declarations: [TenderiHomeComponent, TenderiHomeDetailComponent],
})
export class TenderiHomeModule {}
