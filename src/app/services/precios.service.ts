import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Tarifa } from '../interfaces/tarifas';
import { Estacionamiento } from '../interfaces/estacionamiento';

@Injectable({
  providedIn: 'root'
})
export class PreciosService {
  auth = inject(AuthService);

  // Método para obtener todas las tarifas
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

  // Método para actualizar una tarifa por ID
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

  // // Método para calcular la tarifa basada en el tiempo transcurrido
  // calcularTarifa(estacionamiento: Estacionamiento): Promise<number> {
  //   const { horaIngreso, horaEgreso } = estacionamiento;
  
  //   if (!horaIngreso) {
  //     return Promise.reject("La hora de ingreso no está definida.");
  //   }
  
  //   // Convierte las horas de ingreso y egreso a objetos Date para calcular la diferencia de tiempo
  //   const ingreso = new Date(horaIngreso);
  //   const egreso = horaEgreso ? new Date(horaEgreso) : new Date();
  
  //   // Calcula la diferencia en milisegundos y convierte a horas, redondeando a dos decimales
  //   const horasTranscurridas = Math.max(
  //     (egreso.getTime() - ingreso.getTime()) / (1000 * 60 * 60),
  //     0
  //   );
  
  //   // Consulta la tarifa base y calcula el costo
  //   return this.obtenerTarifas().then((tarifas) => {
  //     const tarifaBase = tarifas.find(tarifa => tarifa.descripcion === "tarifa por hora");
  //     if (!tarifaBase || isNaN(parseFloat(tarifaBase.valor))) {
  //       throw new Error("No se encontró la tarifa base o su valor es inválido");
  //     }
  
  //     const costo = parseFloat(tarifaBase.valor) * horasTranscurridas;
  //     return parseFloat(costo.toFixed(2)); // Redondea a dos decimales
  //   });
  // }
  
}
