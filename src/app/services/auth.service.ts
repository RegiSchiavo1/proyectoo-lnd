import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getToken(): string{
  return localStorage.getItem("token") ?? "";
}

estaLogueado(): boolean{
  if (this.getToken())
    return true;
 else
  return false;

} 
  auth = (AuthService)
 

Login(datosLogin:Login){
return fetch("http://localhost:4000/login",{ //fetch se comunica con back end
  method:"POST",
  headers: { //parámetros que hay que pasarle, headers y body
    "Content-Type":"application/json" //indico q es un objeto lo q estoy mandando
  },
  body: JSON.stringify(datosLogin)
})  
    .then(res => { 
    return res.json().then(resJson => { //permiten encadenar acciones que se ejecutan una tras otra, manejando el flujo asíncrono de las solicitudes de red. Sin ellos, no podrías manejar correctamente los datos una vez que se reciben.
      if(resJson.status === "ok" ){
        localStorage.setItem("token", resJson.token);
        return true;
      }else{
        return false;
      }
    })
})
}

Logout() {
  localStorage.removeItem("token");
}




}

