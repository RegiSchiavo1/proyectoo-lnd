import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cocheras';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './estado-cocheras.component.html',
  styleUrls: ['./estado-cocheras.component.scss'], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EstadoCocherasComponent {

  titulo = "Estado de Cocheras";
  header: { nro: string, disponibilidad: string, ingreso: string, acciones: string } = {
    nro: "Número",
    disponibilidad: "Disponibilidad",
    ingreso: "Ingreso",
    acciones: ""
  }

  filas: Cochera[] = []; // Lista de cocheras
  cocheras: Cochera[] = []; // Array para almacenar todas las cocheras de la base de datos
  currentCocheraIndex: number = 0; // Para llevar la cuenta de la cochera actual

  auth = inject(AuthService);

  ngOnInit() {
    // Cargar todas las cocheras inicialmente
    this.getCocheras();
  }

  getCocheras() {
    fetch("http://localhost:4000/cocheras", {
      headers: {
        authorization: "Bearer " + localStorage.getItem('token')
      }
    })
      .then(r => r.json())
      .then(data => {
        this.cocheras = data; // Almacena todas las cocheras
        console.log('Cocheras cargadas:', this.cocheras);
      })
      .catch(error => {
        console.error('Error al cargar las cocheras:', error);
      });
  }

  agregarCochera() {
    if (this.currentCocheraIndex < this.cocheras.length) {
      const cochera = this.cocheras[this.currentCocheraIndex];
      this.filas.push(cochera); // Agregar la cochera a la lista de filas
      this.currentCocheraIndex++; // Incrementar el índice para la próxima cochera
    } else {
      Swal.fire("No hay más cocheras para agregar!");;
    }
  }

  eliminarFila( idCochera: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: true
    });
    
    swalWithBootstrapButtons.fire({
      title: "¿Estás seguro de borrarlo?",
      text: "No vas a poder revertirlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, ¡Borrar!",
      cancelButtonText: "No, ¡No lo borres!",
      cancelButtonColor: "#630c00",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Realizar la solicitud DELETE al backend
        fetch(`http://localhost:4000/cocheras/${idCochera}`, {  // Usar comillas invertidas
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization: "Bearer " + localStorage.getItem('token')
          }
        })
        
        .then(response => {
          if (response.ok) {
            // Si la eliminación fue exitosa en el backend
            swalWithBootstrapButtons.fire({
              title: "Genial!",
              text: "La cochera se borró con éxito!",
              icon: "success"
            });
            // Eliminar la fila en el frontend
            this.filas.splice(idCochera, 1);
            
          } else {
            // Manejo de errores del backend
            swalWithBootstrapButtons.fire({
              title: "Error",
              text: "NO SE PUDO BORRAR LA COCHERA",
              icon: "error"
            });
          }
        })
        .catch(error => {
          // Manejo de errores en la solicitud
          console.error('Error al borrar la cochera:', error);
          swalWithBootstrapButtons.fire({
            title: "Error",
            text: "Ocurrió un error al borrar la cochera",
            icon: "error"
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "La cochera no ha sido eliminada",
          icon: "error"
        });
      }
    });
  }
  

  cambiarDisponibilidadCochera(numeroFila: number) {


    if (this.filas[numeroFila].deshabilitada === 1) {
      this.filas[numeroFila].deshabilitada = 0;
    } else {
      this.filas[numeroFila].deshabilitada = 1;
    }
  }
}