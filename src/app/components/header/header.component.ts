import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router) {}
  

  elegirVehiculo() {
    const inputOptions = {
      auto: "Auto",
      moto: "Moto",
      camioneta: "Camioneta"
    };

    Swal.fire({
      title: "Seleccioná tu vehículo",
      input: "radio",
      inputOptions: inputOptions,
      inputValidator: (value) => {
        if (!value) {
          return "Necesitás seleccionar alguno!";
        }
        return null;
      }
    }).then((result) => {
      if (result.value && result.isConfirmed) {
        let url = "";
        switch (result.value) {
          case "auto":
            url = "/precios-autos";
            break;
          case "moto":
            url = "/precios-motos";
            break;
          case "camioneta":
            url = "/precios-camionetas";
            break;
        }

        this.router.navigate([url]); 
      }
    });
  }
}
