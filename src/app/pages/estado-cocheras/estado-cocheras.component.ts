import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cocheras';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { CocherasService } from '../../services/cocheras.service';
import { PreciosService } from '../../services/precios.service';
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
  precios = inject(PreciosService);

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
        this.cocheras.eliminarCochera(idCochera).then(() => {
          swalWithBootstrapButtons.fire("Genial!", "La cochera se borró con éxito!", "success");
          this.filas = this.filas.filter(f => f.id !== idCochera);
        }).catch(error => {
          console.error('Error al borrar la cochera:', error);
          swalWithBootstrapButtons.fire("Error", "Ocurrió un error al borrar la cochera", "error");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire("Cancelado", "La cochera no ha sido eliminada", "error");
      }
    });
  }

  habilitarCochera(idCochera: number) {
    const cochera = this.filas.find(c => c.id === idCochera);
    if (!cochera) return;
  
    // Si la cochera tiene un estacionamiento activo, abre el modal de cálculo de tarifa
    if (cochera.activo) {
      this.abrirModalCalculoTarifa(cochera as Cochera & { activo: Estacionamiento });
      return;
    }
  
    Swal.fire({
      title: "La cochera está no disponible. ¿Te gustaría cambiarla a disponible?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Cambiar",
      denyButtonText: "No cambiar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cocheras.habilitarCochera(cochera).then(() => {
          Swal.fire("¡Cambios guardados!", "La cochera ahora está disponible.", "success");
          this.getCocheras();
        }).catch(error => {
          console.error('Error al habilitar la cochera:', error);
          Swal.fire("Error", "Ocurrió un error al intentar cambiar la disponibilidad.", "error");
        });
      } else if (result.isDenied) {
        Swal.fire("Los cambios no fueron guardados", "", "info");
      }
    });
  }
  
  deshabilitarCochera(idCochera: number) {
    const cochera = this.filas.find(c => c.id === idCochera);
    if (!cochera) return;
  
    // Si la cochera tiene un estacionamiento activo, abre el modal de cálculo de tarifa
    if (cochera.activo) {
      this.abrirModalCalculoTarifa(cochera as Cochera & { activo: Estacionamiento });
      return;
    }
  
    Swal.fire({
      title: "La cochera está disponible. ¿Te gustaría cambiarla a no disponible?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Cambiar",
      denyButtonText: "No cambiar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cocheras.deshabilitarCochera(cochera).then(() => {
          Swal.fire("¡Cambios guardados!", "La cochera ahora está no disponible.", "success");
          this.getCocheras();
        }).catch(error => {
          console.error('Error al deshabilitar la cochera:', error);
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

  //  calcularTarifa(estacionamiento: Estacionamiento): Promise<number> {
  //    return this.precios.calcularTarifa(estacionamiento);
  //  }
  abrirModalCalculoTarifa(cochera: Cochera & { activo: Estacionamiento | null }) {
    if (!cochera.activo) return;
  
    Swal.fire({
      title: "¿Deseas dejar de utilizar esta cochera?",
      text: "Esto calculará el costo final y liberará la cochera.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, calcular y cerrar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed && cochera.activo) {
        this.estacionamientos.cerrarEstacionamiento(cochera.activo.patente, cochera.id)
          .then(response => {
            // Asegúrate de acceder a los campos correctos
            if (response && response.message && response.costo != null) {
              Swal.fire({
                title: "Estacionamiento cerrado",
                text: `La tarifa total es: $${response.costo}`, // Usa response.costo
                icon: "success"
              });
              this.getCocheras(); // Refresca las cocheras
            } else {
              throw new Error("Respuesta del servidor incompleta o incorrecta");
            }
          })
          .catch(error => {
            console.error("Error al cerrar el estacionamiento:", error);
            Swal.fire("Error", "No se pudo cerrar el estacionamiento. Inténtalo nuevamente.", "error");
          });
      }
    });
  }
  

  
  
  
  

  // liberarCochera(idEstacionamiento: number) {
  //   this.estacionamientos.liberarCochera(idEstacionamiento).then(response => {
  //     Swal.fire("Éxito", "La cochera ha sido liberada correctamente", "success");
  //     this.getCocheras();
  //   }).catch(error => {
  //     Swal.fire("Error", "No se pudo liberar la cochera. Inténtalo nuevamente.", "error");
  //     console.error('Error al liberar la cochera:', error);
  //   });
  // }
}




