import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-precios-autos',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './precios-autos.component.html',
  styleUrls: ['./precios-autos.component.scss']
})
export class PreciosAutosComponent implements OnInit {

  preciosauto: any = {
    precio1: "$500",
    precio2: "$800",
    precio3: "$1,500",
    precio4: "$2,500",
    precio5: "$4,000",
    precio6: "$6,000",
    precio7: "$8,000",
    precio8: "$10,000"
  };

  // Al cargar el componente, verificar si hay datos en localStorage
  ngOnInit() {
    const storedPrecios = localStorage.getItem('precios');
    if (storedPrecios) {
      this.preciosauto = JSON.parse(storedPrecios);
    }
  }

  async actualizar(precioKey: string) {
    
    try {
      
      // Mostrar el cuadro de diálogo SweetAlert2 para ingresar el nuevo precio
      const { value: nuevoPrecio } = await Swal.fire({
        title: "Ingrese el nuevo precio",
        input: "number",
        inputLabel: ` Ingrese el nuevo precio:`,
        inputValue: this.preciosauto[precioKey].replace('$', ''),  // Mostrar el precio actual en el input sin el símbolo de dólar
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
        this.preciosauto[precioKey] = `$${nuevoPrecio}`;  // Agregar el símbolo de dólar al nuevo precio
  
        // Mostrar un mensaje de confirmación
        Swal.fire(`El nuevo precio es ${nuevoPrecio}`);
  
        // Guardar en localStorage
        localStorage.setItem('precios', JSON.stringify(this.preciosauto));
      }
    } catch (error) {
      // Manejar errores en caso de que falle la obtención de la IP o el SweetAlert
      console.error("Error al obtener la IP o mostrar la alerta", error);
      Swal.fire('Error', 'No se pudo obtener la IP o procesar la solicitud', 'error');
    }
  }
}  