import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../components/header/header.component";
import { ReportesService } from '../services/reportes.service';
import { Reportes } from './../interfaces/reportes';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [HeaderComponent,],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  reportes: Reportes[] = [];

  constructor(private reportesService: ReportesService) {}

  ngOnInit() {
    this.cargarReportes();
  }

  cargarReportes() {
    this.reportesService.obtenerReportes().then(data => {
      this.reportes = data;
    }).catch(error => {
      console.error("Error al cargar reportes:", error);
    });
  }
}
