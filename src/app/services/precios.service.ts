import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Tarifa } from '../interfaces/tarifas';
import { Estacionamiento } from '../interfaces/estacionamiento';

@Injectable({
  providedIn: 'root'
})
export class PreciosService {
  auth = inject(AuthService);

  
  obtenerTarifas(): Promise<Tarifa[]> {
    return fetch("http://localhost:4000/tarifas", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? '')
      }
    })
    .then(response => response.json())
    .catch(error => {
      console.error('Error al cargar tarifas:', error);
      throw error;
    });
  }

 
  actualizarTarifa(id: string, nuevoPrecio: number): Promise<Tarifa> {
    return fetch(`http://localhost:4000/tarifas/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: "Bearer " + (this.auth.getToken() ?? ''),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ valor: nuevoPrecio.toString() })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud al actualizar tarifa');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error al actualizar tarifa:', error);
      throw error;
    });
  }


  
}
