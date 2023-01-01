import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(registration: { password: string; langKey: string; login: string; email: string | null }): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), registration);
  }
}
