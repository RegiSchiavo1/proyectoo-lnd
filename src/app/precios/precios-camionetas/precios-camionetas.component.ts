import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-precios-camionetas',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './precios-camionetas.component.html',
  styleUrl: './precios-camionetas.component.scss'
})
export class PreciosCamionetasComponent implements OnInit {

  precioscamioneta: any = {
    preciocamioneta1: "$500",
    preciocamioneta2: "$800",
    preciocamioneta3: "$1,500",
    preciocamioneta4: "$2,500",
    preciocamioneta5: "$4,000",
    preciocamioneta6: "$6,000",
    preciocamioneta7: "$8,000",
    preciocamioneta8: "$10,000"
  };

  // Al cargar el componente, verificar si hay datos en localStorage
  ngOnInit() {
    const storedPrecios = localStorage.getItem('precioscamioneta');
    if (storedPrecios) {
      this.precioscamioneta = JSON.parse(storedPrecios);
    }
  }

  async actualizar(precioKey: string) {
    
    try {
      
      // // Mostrar el cuadro de diálogo SweetAlert2 para ingresar el nuevo precio
       const { value: nuevoPrecio } = await Swal.fire({
         title: "Ingrese el nuevo precio",
        input: "number",
         inputLabel: ` Ingrese el nuevo precio:`,
      inputValue: this.precioscamioneta[precioKey].replace('$', ''),  // Mostrar el precio actual en el input sin el símbolo de dólar
         showCancelButton: true,
        inputValidator: (value) => {
           // Validar que el valor no esté vacío
           if (!value) {
             return "Debes escribir algo!";  // Retorna el mensaje si está vacío
          }
           // Validar que el valor sea un número
           const numberValue = parseFloat(value);
           if (isNaN(numberValue) || numberValue <= 0) {
          return "Debes ingresar un número válido!";  // Retorna el mensaje si no es un número
          }
           return null;  // Retorna null si todo está bien
         }
       });
      
      // Si el usuario ingresa un nuevo precio
      if (nuevoPrecio) {
        // Actualizar el precio en el objeto
        this.precioscamioneta[precioKey] = `$${nuevoPrecio}`;  // Agregar el símbolo de dólar al nuevo precio
  
        // Mostrar un mensaje de confirmación
        Swal.fire(`El nuevo precio es ${nuevoPrecio}`);
  
        // Guardar en localStorage
        localStorage.setItem('precioscamioneta', JSON.stringify(this.precioscamioneta));
      }
    } catch (error) {
      // Manejar errores en caso de que falle la obtención de la IP o el SweetAlert
      console.error("Error al obtener la IP o mostrar la alerta", error);
      Swal.fire('Error', 'No se pudo obtener la IP o procesar la solicitud', 'error');
    }
  }
}  