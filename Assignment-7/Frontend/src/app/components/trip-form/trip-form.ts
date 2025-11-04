import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Driver } from '../../models/driver.model';
import { Vehicle } from '../../models/vehicle.model';
import { TripService } from '../../services/trip';
import { DriverService } from '../../services/driver';
import { VehicleService } from '../../services/vehicle';
import { Trip } from '../../models/trip.model';
@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.css',
})
export class TripFormComponent implements OnInit {
  tripForm!: FormGroup;
  isEdit: boolean = false;
  availableDrivers: Driver[] = [];
  availableVehicles: Vehicle[] = [];

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    public dialogRef: MatDialogRef<TripFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { trip: Trip | null, isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
  }

  ngOnInit(): void {
    this.loadAvailableDrivers();
    this.loadAvailableVehicles();

    this.tripForm = this.fb.group({
      id: [this.data.trip?.id || 0],
      driverId: [this.data.trip?.driverId || '', Validators.required],
      vehicleId: [this.data.trip?.vehicleId || '', Validators.required],
      source: [this.data.trip?.source || '', Validators.required],
      destination: [this.data.trip?.destination || '', Validators.required],
      startDate: [this.data.trip?.startDate ? new Date(this.data.trip.startDate) : new Date(), Validators.required],
      endDate: [this.data.trip?.endDate ? new Date(this.data.trip.endDate) : new Date(), Validators.required],
      status: [this.data.trip?.status || 'Schedule']
    });
  }

  loadAvailableDrivers(): void {
    this.driverService.getAllDrivers().subscribe({
      next: (data) => {
        this.availableDrivers = data.filter(d => d.isAvailable || d.driverId === this.data.trip?.driverId);
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
      }
    });
  }

  loadAvailableVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.availableVehicles = data.filter(v => v.isAvailable || v.vehicleId === this.data.trip?.vehicleId);
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      const trip: Trip = this.tripForm.value;
      
      if (this.isEdit && trip.id) {
        this.tripService.updateTrip(trip.id, trip).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating trip:', error);
            alert('Error updating trip: ' + (error.error || error.message));
          }
        });
      } else {
        this.tripService.createTrip(trip).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating trip:', error);
            alert('Error creating trip: ' + (error.error || error.message));
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

