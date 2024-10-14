import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-precios-motos',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './precios-motos.component.html',
  styleUrl: './precios-motos.component.scss'
})
export class PreciosMotosComponent implements OnInit {

  preciosmoto: any = {
    preciomoto1: "$500",
    preciomoto2: "$800",
    preciomoto3: "$1,500",
    preciomoto4: "$2,500",
    preciomoto5: "$4,000",
    preciomoto6: "$6,000",
    preciomoto7: "$8,000",
    preciomoto8: "$10,000"
  };

  // Al cargar el componente, verificar si hay datos en localStorage
  ngOnInit() {
    const storedPrecios = localStorage.getItem('preciosmoto');
    if (storedPrecios) {
      this.preciosmoto = JSON.parse(storedPrecios);
    }
  }

  async actualizar(precioKey: string) {
    
    try {
      
      // Mostrar el cuadro de diálogo SweetAlert2 para ingresar el nuevo precio
      const { value: nuevoPrecio } = await Swal.fire({
        title: "Ingrese el nuevo precio",
        input: "number",
        inputLabel: ` Ingrese el nuevo precio:`,
        inputValue: this.preciosmoto[precioKey].replace('$', ''),  // Mostrar el precio actual en el input sin el símbolo de dólar
        showCancelButton: true,
        inputValidator: (value) => {
          // Validar que el valor no esté vacío
          if (!value) {
            return "Tenés que escribir algo!";  // Retorna el mensaje si está vacío
          }
          // Validar que el valor sea un número
          const numberValue = parseFloat(value);
          if (isNaN(numberValue) || numberValue <= 0) {
            return "Tenés que ingresar un número válido!";  // Retorna el mensaje si no es un número
          }
          return null;  // Retorna null si todo está bien
        }
      });
      
      // Si el usuario ingresa un nuevo precio
      if (nuevoPrecio) {
        // Actualizar el precio en el objeto
        this.preciosmoto[precioKey] = `$${nuevoPrecio}`;  // Agregar el símbolo de dólar al nuevo precio
  
        // Mostrar un mensaje de confirmación
        Swal.fire(`El nuevo precio es ${nuevoPrecio}`);
  
        // Guardar en localStorage
        localStorage.setItem('preciosmoto', JSON.stringify(this.preciosmoto));
      }
    } catch (error) {
      // Manejar errores en caso de que falle la obtención de la IP o el SweetAlert
      console.error("Error al obtener la IP o mostrar la alerta", error);
      Swal.fire('Error', 'No se pudo obtener la IP o procesar la solicitud', 'error');
    }
  }
}  