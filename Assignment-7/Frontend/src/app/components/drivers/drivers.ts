import { DriverService } from './../../services/driver';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Driver } from '../../models/driver.model';
import { DriverFormComponent } from '../driver-form/driver-form';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';  // ✅ Import MatDialog here
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule,
    MatIconModule,MatDialogModule,
    MatCardModule,MatChipsModule ],
  templateUrl: './drivers.html',
  styleUrl: './drivers.css',
})
export class DriversComponent implements OnInit {

  drivers: Driver[] = [];
  displayedColumns: string[] = [
    'driverId', 
    'driverName', 
    'licenseNumber', 
    'yearOfExperience', 
    'isAvailable',
    'actions'
  ];

  constructor(
    private driverService : DriverService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void{
    this.driverService.getAllDrivers().subscribe({
      next: (data) =>{
        this.drivers = data;
      },
      error: (error) => {
        console.error('Error Loading drivers:',error);
      }
    });
  }

  openAddDialog(): void{
    const dialogRef = this.dialog.open(DriverFormComponent,{
      width: '500px',
      data: {driver:null, isEdit:false}
    });
    dialogRef.afterClosed().subscribe((result : boolean)=> {
      if (result) {
        this.loadDrivers();
      }
    });
  }

  openEditDialog(driver: Driver): void {  
    const dialogRef = this.dialog.open(DriverFormComponent, {
      width: '500px',
      data: { driver: { ...driver }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadDrivers();
      }
    });
  }

  deleteDriver(id: number): void {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.driverService.deleteDriver(id).subscribe({
        next: () => {
          this.loadDrivers();
        },
        error: (error) => {
          console.error('Error deleting driver:', error);
          alert('Error deleting driver. It may be assigned to trips.');
        }
      });
    }
  }
}
