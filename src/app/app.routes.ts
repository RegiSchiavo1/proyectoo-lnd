import { Router, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { ReportesComponent } from './reportes/reportes.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PreciosAutosComponent } from './precios/precios-autos/precios-autos.component';
import { PreciosMotosComponent } from './precios/precios-motos/precios-motos.component';
import { PreciosCamionetasComponent } from './precios/precios-camionetas/precios-camionetas.component';


function guardaLogueado(){
    let auth= inject(AuthService);
    let router= inject(Router)
    
    if (auth.estaLogueado())
        return true;
       else{
    router.navigate(['/login']);
    return false;
}
}

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent

    },
    {
        path: "estado-cocheras",
        component: EstadoCocherasComponent,
        canActivate:[guardaLogueado]
    },
    {
        path: "",
        redirectTo:"login",
        pathMatch:"full"
    },

    {
        path: "reportes",
        component: ReportesComponent
    },
    {
        path: "precios-autos",
        component: PreciosAutosComponent
    },
    {
        path: "precios-motos",
        component: PreciosMotosComponent
    },    {
        path: "precios-camionetas",
        component: PreciosCamionetasComponent
    },

];
