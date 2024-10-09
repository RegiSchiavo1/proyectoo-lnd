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
  imports: [RouterModule,CommonModule,HeaderComponent,],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class EstadoCocherasComponent {

  titulo= "Estado de Cocheras";
  header: { nro:string, disponibilidad:string, ingreso:string, acciones:string } = {
    nro: "Número",
    disponibilidad: "Disponibilidad",
    ingreso: "Ingreso",
    acciones: ""
}

filas: Cochera [] = [];
ngOnInit(){
  this.getCocheras().then(cocheras => {
    this.filas = cocheras;
  });
}
auth= inject(AuthService);
getCocheras(){{
  return fetch("http://localhost:4000/cocheras",{
    headers:{
      authorization:"Bearer " + localStorage.getItem('token')
    },
  }).then(r => r.json())
}}


   eliminarFila(numeroFila: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: " ¿Estás seguro? ",
      text: " ¡No vas a poder revertirlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: " Si, borralo",
      cancelButtonText: " ¡No, no lo borres!",
      cancelButtonColor: "630c00",
      cancelButtonAriaLabel:"630c00",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "¡Bien hecho!",
          text: "La fila ha sido borrada con éxito :) ",
          icon: "success"
        });
        this.filas.splice(numeroFila,1);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "La cochera no ha sido borrada",
          icon: "error"
        });
      }
    });
   }

    cambiarDisponibilidadCochera(numeroFila: number){
     
    
     if(this.filas[numeroFila].deshabilitada=== 1){
      this.filas[numeroFila].deshabilitada = 0;
      } else {
       this.filas[numeroFila].deshabilitada = 1
      }
    }
    

}