import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PreciosComponent } from '../../precios/precios.component';
import { ReportesComponent } from '../../reportes/reportes.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, PreciosComponent, ReportesComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
