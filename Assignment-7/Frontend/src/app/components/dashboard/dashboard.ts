import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Driver } from '../../models/driver.model';
import { Trip } from '../../models/trip.model';
import { Vehicle } from '../../models/vehicle.model';
import { DriverService } from '../../services/driver';
import { TripService } from '../../services/trip';
import { VehicleService } from '../../services/vehicle';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  totalDrivers: number = 0;
  availableDrivers: number = 0;
  totalVehicles: number = 0;
  availableVehicles: number = 0;
  activeTrips: Trip[] = [];
  completedTrips: Trip[] = [];
  longTrips: Trip[] = [];

  displayedColumns: string[] = ['id', 'source', 'destination', 'startDate', 'status'];

  constructor(
    private tripService: TripService,
    private driverService: DriverService,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loadDriverStats();
    this.loadVehicleStats();
    this.loadTripStats();
    this.loadLongTrips();
  }

  loadDriverStats(): void {
    this.driverService.getAllDrivers().subscribe({
      next: (drivers: Driver[]) => {
        this.totalDrivers = drivers.length;
        this.availableDrivers = drivers.filter(d => d.isAvailable).length;
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
      }
    });
  }

  loadVehicleStats(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles: Vehicle[]) => {
        this.totalVehicles = vehicles.length;
        this.availableVehicles = vehicles.filter(v => v.isAvailable).length;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
      }
    });
  }

  loadTripStats(): void {
    this.tripService.getAllTrips().subscribe({
      next: (trips: Trip[]) => {
        this.activeTrips = trips.filter(t => t.status !== 'Completed');
        this.completedTrips = trips.filter(t => t.status === 'Completed');
      },
      error: (error) => {
        console.error('Error loading trips:', error);
      }
    });
  }

  loadLongTrips(): void {
    this.tripService.getLongTrips().subscribe({
      next: (trips: Trip[]) => {
        this.longTrips = trips;
      },
      error: (error) => {
        console.error('Error loading long trips:', error);
      }
    });
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }
}