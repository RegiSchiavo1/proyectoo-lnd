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

  
  ngOnInit() {
    const storedPrecios = localStorage.getItem('precioscamioneta');
    if (storedPrecios) {
      this.precioscamioneta = JSON.parse(storedPrecios);
    }
  }

  async actualizar(precioKey: string) {
    
    try {
      
      
       const { value: nuevoPrecio } = await Swal.fire({
         title: "Ingrese el nuevo precio",
        input: "number",
         inputLabel: ` Ingrese el nuevo precio:`,
      inputValue: this.precioscamioneta[precioKey].replace('$', ''),  
         showCancelButton: true,
        inputValidator: (value) => {
          
           if (!value) {
             return "Debes escribir algo!";  
          }
           
           const numberValue = parseFloat(value);
           if (isNaN(numberValue) || numberValue <= 0) {
          return "Debes ingresar un número válido!";  
          }
           return null; 
         }
       });
      
     
      if (nuevoPrecio) {
        
        this.precioscamioneta[precioKey] = `$${nuevoPrecio}`;  
  
        
        Swal.fire(`El nuevo precio es ${nuevoPrecio}`);
  
        
        localStorage.setItem('precioscamioneta', JSON.stringify(this.precioscamioneta));
      }
    } catch (error) {
      
      console.error("Error al obtener la IP o mostrar la alerta", error);
      Swal.fire('Error', 'No se pudo obtener la IP o procesar la solicitud', 'error');
    }
  }
}  