import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Cochera } from '../interfaces/cocheras';

@Injectable({
  providedIn: 'root'
})
export class CocherasService {

  auth = inject(AuthService);

  cocheras(): Promise<Cochera[]> {
    return fetch('http://localhost:4000/cocheras', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
      },
    }).then(r => r.json());
  }

  habilitarCochera(cochera: Cochera) {
    return fetch(`http://localhost:4000/cocheras/${cochera.id}/enable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.getToken()}`
      }
    });
  }
  
  deshabilitarCochera(cochera: Cochera) {
    return fetch(`http://localhost:4000/cocheras/${cochera.id}/disable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.getToken()}`
      }
    });
  }
}