// src/app/components/configuracion-tienda/configuracion-tienda.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { ConfiguracionTienda } from '../../models/configuracion.model';

@Component({
  selector: 'app-configuracion-tienda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion-tienda.component.html',
  styleUrls: ['./configuracion-tienda.component.css']
})
export class ConfiguracionTiendaComponent implements OnInit {
  config: ConfiguracionTienda = {
    id: '',
    nombre_tienda: '',
    direccion: '',
    telefono: '',
    rfc: '',
    lema: '',
    mensaje_ticket: ''
  } as ConfiguracionTienda;
  
  loading = false;
  guardando = false;
  mostrarPrevia = false;
  mensajeExito = '';
  today = new Date();

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    await this.cargarConfiguracion();
  }

  async cargarConfiguracion() {
    this.loading = true;
    try {
      this.config = await this.supabase.getConfiguracionTienda();
    } catch (error: any) {
      console.error('Error cargando configuración:', error);
      alert('Error: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  async guardarConfiguracion() {
    this.guardando = true;
    this.mensajeExito = '';
    
    try {
      await this.supabase.updateConfiguracionTienda(this.config);
      this.mensajeExito = 'Configuración guardada exitosamente';
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);
      
    } catch (error: any) {
      console.error('Error guardando configuración:', error);
      alert('Error: ' + error.message);
    } finally {
      this.guardando = false;
    }
  }

  previsualizarTicket() {
    this.mostrarPrevia = !this.mostrarPrevia;
  }

  // Método para mostrar cómo se vería en un ticket real
  generarEjemploTicket() {
    return `
    ================================
        ${this.config.nombre_tienda}
    ================================
    ${this.config.direccion}
    Tel: ${this.config.telefono}
    ${this.config.rfc ? 'RFC: ' + this.config.rfc : ''}
    
    --------------------------------
    Fecha: ${new Date().toLocaleDateString()}
    Hora: ${new Date().toLocaleTimeString()}
    --------------------------------
    
    Ejemplo de venta:
    1 x Pastel Chocolate  $350.00
    
    --------------------------------
    Total:               $350.00
    ================================
    ${this.config.mensaje_ticket}
    ================================
    `;
  }
}