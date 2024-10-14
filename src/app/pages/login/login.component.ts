import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from '../../interfaces/login';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  datosLogin: Login = {
    username: 'admin',
    password: 'admin'
  };
  
  recordarme: boolean = false; // Variable para vincular al checkbox

  router = inject(Router);
  auth = inject(AuthService);

  Login() {
    this.auth.Login(this.datosLogin).then(ok => {
      if (ok) {
        this.router.navigate(['/estado-cocheras']);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña/usuario no es correcta/o',
          footer: '<a href="#">Por qué tengo este problema?</a>'
        });
      }
    });
  }

  recordar() {
    const checkbox = document.getElementById('rememberCheck') as HTMLInputElement;
    if (checkbox.checked) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
  
      Toast.fire({
        icon: 'success',
        title: 'Usuario recordado con éxito!'
      }).then(() => {
        // Desmarcar la checkbox
        checkbox.checked = false;
      });
    }
  }

  registrarse() {
    Swal.fire({
      title: "Ingrese sus datos",
      html:
        '<label for="usuario">Usuario</label>' +
        '<input type="text" id="Usuario" class="swal2-input" placeholder="">' +
        '<label for="contraseña">Contraseña</label>' +
        '<input type="text" id="Contraseña" class="swal2-input" placeholder="">',
      showCancelButton: true,
      preConfirm: () => {
        const usuario = (document.getElementById('Usuario') as HTMLInputElement).value;
        const contraseña = (document.getElementById('Contraseña') as HTMLInputElement).value;
  
        if (!usuario || !contraseña) {
          Swal.showValidationMessage('Both fields are required');
        }
        return { usuario: usuario, contraseña: contraseña };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Usuario:', result.value?.usuario);
        console.log('Contraseña:', result.value?.contraseña);
        Swal.fire("Te registraste con éxito!");
      }
    });
  }

  olvide() {
    Swal.fire({
      title: "Ingrese una dirección de mail",
      input: "email",
      inputLabel: "Se le enviará un mail para reestablecer su contraseña",
      
    }).then((result) => {
      if (result.value) {
        Swal.fire("Se ha enviado el mail!");
      }
    });
  }
}
