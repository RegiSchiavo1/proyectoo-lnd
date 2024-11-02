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

 
  ngOnInit() {
    const storedPrecios = localStorage.getItem('preciosmoto');
    if (storedPrecios) {
      this.preciosmoto = JSON.parse(storedPrecios);
    }
  }

  async actualizar(precioKey: string) {
    
    try {
      
      
      const { value: nuevoPrecio } = await Swal.fire({
        title: "Ingrese el nuevo precio",
        input: "number",
        inputLabel: ` Ingrese el nuevo precio:`,
        inputValue: this.preciosmoto[precioKey].replace('$', ''),  
        showCancelButton: true,
        inputValidator: (value) => {
          
          if (!value) {
            return "Tenés que escribir algo!";  
          }
          
          const numberValue = parseFloat(value);
          if (isNaN(numberValue) || numberValue <= 0) {
            return "Tenés que ingresar un número válido!";  
          }
          return null;  
        }
      });
      
    
       if (nuevoPrecio) {
         
         this.preciosmoto[precioKey] = `$${nuevoPrecio}`;  
  
         
         Swal.fire(`El nuevo precio es ${nuevoPrecio}`);
  
        
         localStorage.setItem('preciosmoto', JSON.stringify(this.preciosmoto));
       }
     } catch (error) {
       
       console.error("Error al obtener la IP o mostrar la alerta", error);
       Swal.fire('Error', 'No se pudo obtener la IP o procesar la solicitud', 'error');
     }
  }
}  