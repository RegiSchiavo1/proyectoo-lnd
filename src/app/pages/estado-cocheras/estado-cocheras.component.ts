import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cocheras';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { EstacionamientosService } from '../../services/estacionamientos.service';

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
  estacionamientos = inject(EstacionamientosService)
  
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
        fetch(`http://localhost:4000/cocheras/${idCochera}`, {  
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization: "Bearer " + localStorage.getItem('token')
          }
        })
        
        .then(response => {
          if (response.ok) {
            // Si la eliminación se pudo
            swalWithBootstrapButtons.fire({
              title: "Genial!",
              text: "La cochera se borró con éxito!",
              icon: "success"
            });
            // Eliminar la fila en el frontend
            this.filas = this.filas.filter(f => f.id !== idCochera);
            
          } else {
            // Manejo de errores del back
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
    const cochera = this.filas[numeroFila]; // Acceder a la cochera actual
    
    // Definir el estado actual y el próximo estado
    const estadoActual = cochera.deshabilitada === 0 ? 'disponible' : 'no disponible';
    const proximoEstado = cochera.deshabilitada === 0 ? 'no disponible' : 'disponible';
    
    // Definir las URLs para habilitar o deshabilitar
    const url = `http://localhost:4000/cocheras/${cochera.id}/${cochera.deshabilitada === 0 ? 'disable' : 'enable'}`;
    
    Swal.fire({
      title: `La cochera está ${estadoActual}. ¿Te gustaría cambiarla a ${proximoEstado}?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Cambiar",
      denyButtonText: "No cambiar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Realizar la solicitud al backend para cambiar la disponibilidad
        fetch(url, {
          method: 'POST', // Método POST para cambiar el estado
          headers: {
            'Content-Type': 'application/json',
            authorization: "Bearer " + localStorage.getItem('token')
          }
        })
        .then(response => {
          if (response.ok) {
            // Si el backend responde correctamente, cambiar el estado en el frontend
            cochera.deshabilitada = cochera.deshabilitada === 0 ? 1 : 0; // Alternar entre 0 y 1
            Swal.fire("¡Cambios guardados!", `La cochera ahora está ${proximoEstado}.`, "success");
          } else {
            // Manejo de errores del backend
            Swal.fire("Error", "No se pudo cambiar la disponibilidad de la cochera.", "error");
          }
        })
        .catch(error => {
          console.error('Error al cambiar la disponibilidad de la cochera:', error);
          Swal.fire("Error", "Ocurrió un error al intentar cambiar la disponibilidad.", "error");
        });
      } else if (result.isDenied) {
        Swal.fire("Los cambios no fueron guardados", "", "info");
      }
    });
  }
  
  
  abrirModalNuevoEstacionamiento(idCochera:number){
    
    Swal.fire({
      title: "Ingrese su patente",
      input: "text",
      // inputLabel: "Your IP address",
      showCancelButton: true,
      inputValidator: (value) => { 
        if (!value) {
          return "Necesitás escribir algo!";
        }
        return
      }
    }).then(res =>{
      if(res.isConfirmed){
        this.estacionamientos.estacionarAuto(res.value,idCochera).then(()=> {
          this.getCocheras()
        }) 
      }
    }) 
  }
//!!!!!!!!!!!!!!
  MostrarCochera() {
    if (this.currentCocheraIndex < this.cocheras.length) {
      const cochera = this.cocheras[this.currentCocheraIndex];
      this.filas.push(cochera); // Agregar la cochera a la lista de filas
      this.currentCocheraIndex++; // Incrementar el índice para la próxima cochera
     }// else {
    //   Swal.fire("No hay más cocheras para agregar!");;
    // }
  }


}