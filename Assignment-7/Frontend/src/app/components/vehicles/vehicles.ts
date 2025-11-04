import { VehicleService } from './../../services/vehicle';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.css',
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  displayColumns: string[] = [
    'vehicleId',
    'vehicleNumber', 
    'vehicleType', 
    'vehicleModel', 
    'isAvailable', 
    'actions'
  ];

  constructor(
    private vehicleService : VehicleService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
      this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
      }
    });
  }

  openAddDialog(): void{
    const dialogRef = this.dialog.open(VehicleFormComponent,{
      width: '500px',
      data: { vehicle:null, isEdit: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.loadVehicles();
      }
    });
  }

  openEditDialog(vehicle:Vehicle): void{
    const dialogRef = this.dialog.open(VehicleFormComponent, {
      width: '500px',
      data: { vehicle: { ...vehicle }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVehicles();
      }
    });
  }

  deleteVehicle(id: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          this.loadVehicles();
        },
        error: (error) => {
          console.error('Error deleting vehicle:', error);
          alert('Error deleting vehicle. It may be assigned to trips.');
        }
      });
    }
  }
}


