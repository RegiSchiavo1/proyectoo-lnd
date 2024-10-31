import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientosService {
  auth = inject(AuthService);

  estacionamientos(): Promise<Estacionamiento[]> {
    return fetch('http://localhost:4000/estacionamientos', {
      method: 'GET',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
      },
    }).then(r => r.json());
  }

  buscarEstacionamientoActivo(cocheraId: number) {
    return this.estacionamientos().then(estacionamientos => {
      let buscado = null;
      for (let estacionamiento of estacionamientos) {
        if (estacionamiento.idCochera === cocheraId && estacionamiento.horaEgreso === null) {
          buscado = estacionamiento;
        }
      }
      return buscado;
    });
  }

  estacionarAuto(patenteAuto: string, idCochera: number) {
    return fetch('http://localhost:4000/estacionamientos/abrir', {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patente: patenteAuto,
        idCochera: idCochera
      })
    }).then(r => r.json());
  }

  liberarCochera(idEstacionamiento: number) {
    return fetch('http://localhost:4000/estacionamientos/cerrar', {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idEstacionamiento: idEstacionamiento,
        horaEgreso: new Date().toISOString() // Marca la hora de egreso actual
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Error al cerrar el estacionamiento');
      }
      return response.json();
    });
  }
}

