import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { PreciosService } from '../../services/precios.service';
import Swal from 'sweetalert2';
import { Tarifa } from '../../interfaces/tarifas';
import { HeaderComponent } from '../../components/header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-precios-autos',
  standalone:true,
  imports:[HeaderComponent,FormsModule,CommonModule],
  templateUrl: './precios-autos.component.html',
  styleUrls: ['./precios-autos.component.scss'],
  
})
export class PreciosAutosComponent implements OnInit {

  tarifas: Tarifa[] = []; // Define el tipo con la interfaz, si la decides usar

  constructor(private preciosService: PreciosService) {}

  ngOnInit() {
    this.preciosService.obtenerTarifas()
      .then((data: Tarifa[]) => {
        this.tarifas = data;
        console.log('Tarifas cargadas:',this.tarifas)
      })
      .catch(error => console.error('Error al cargar tarifas:', error));
  }

  actualizar(id: string) {
    Swal.fire({
      title: 'Ingrese el nuevo precio',
      input: 'number',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'Debes escribir algo!';
        const numberValue = parseFloat(value);
        if (isNaN(numberValue) || numberValue <= 0) return 'Debes ingresar un número válido!';
        return null;
      }
    }).then(result => {
      if (result.value) {
        const nuevoPrecio = parseFloat(result.value);
        
        this.preciosService.actualizarTarifa(id, nuevoPrecio)
          .then(updatedTarifa => {
            // Actualizar el precio en la tarifa local
            const index = this.tarifas.findIndex(tarifa => tarifa.id === id);
            if (index !== -1) this.tarifas[index].valor = `$${nuevoPrecio}`;
            Swal.fire(`El nuevo precio es $${nuevoPrecio}`);
          })
          .catch(error => console.error('Error al actualizar tarifa:', error));
      }
    });
  }
}
