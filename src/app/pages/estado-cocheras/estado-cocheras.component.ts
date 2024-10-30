import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cocheras';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { CocherasService } from '../../services/cocheras.service';
import { Estacionamiento } from '../../interfaces/estacionamiento';

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
  };

  filas: (Cochera & { activo: Estacionamiento | null })[] = []; 

  auth = inject(AuthService);
  estacionamientos = inject(EstacionamientosService);
  cocheras = inject(CocherasService);
  
  ngOnInit() {
    this.getCocheras();
  }

  getCocheras() {
    return this.cocheras.cocheras().then(cocheras => {
      this.filas = [];
      for (let cochera of cocheras) {
        this.estacionamientos.buscarEstacionamientoActivo(cochera.id).then(estacionamiento => {
          this.filas.push({
            ...cochera,
            activo: estacionamiento,
          });
        });
      }
    });
  }

  eliminarFila(idCochera: number) {
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
        fetch(`http://localhost:4000/cocheras/${idCochera}`, {  
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization: "Bearer " + localStorage.getItem('token')
          }
        })
        .then(response => {
          if (response.ok) {
            swalWithBootstrapButtons.fire("Genial!", "La cochera se borró con éxito!", "success");
            this.filas = this.filas.filter(f => f.id !== idCochera);
          } else {
            swalWithBootstrapButtons.fire("Error", "NO SE PUDO BORRAR LA COCHERA", "error");
          }
        })
        .catch(error => {
          console.error('Error al borrar la cochera:', error);
          swalWithBootstrapButtons.fire("Error", "Ocurrió un error al borrar la cochera", "error");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire("Cancelado", "La cochera no ha sido eliminada", "error");
      }
    });
  }




  cambiarDisponibilidadCochera(idCochera: number) {
    const cochera = this.filas[idCochera]; // Accede a la cochera actual
    const estadoActual = cochera.deshabilitada ? 'no disponible' : 'disponible';
    const proximoEstado = cochera.deshabilitada ? 'disponible' : 'no disponible';
  
    Swal.fire({
      title: `La cochera está ${estadoActual}. ¿Te gustaría cambiarla a ${proximoEstado}?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Cambiar",
      denyButtonText: "No cambiar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Llama a habilitar o deshabilitar en base al estado actual
        const action = cochera.deshabilitada 
          ? this.cocheras.habilitarCochera(cochera) 
          : this.cocheras.deshabilitarCochera(cochera);
  
        action.then(() => {
          Swal.fire("¡Cambios guardados!", `La cochera ahora está ${proximoEstado}.`, "success");
          this.getCocheras(); // Refresca las cocheras después de realizar el cambio
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
  

  abrirModalNuevoEstacionamiento(idCochera: number) {
    Swal.fire({
      title: "Ingrese su patente",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => { 
        if (!value) {
          return "Necesitás escribir algo!";
        }
        return null;
      }
    }).then(res => {
      if (res.isConfirmed) {
        this.estacionamientos.estacionarAuto(res.value, idCochera).then(() => {
          this.getCocheras();
        });
      }
    });
  }
}
