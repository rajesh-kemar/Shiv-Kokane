import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, Driver, Trip, Vehicle } from '../api';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NgIf],
  templateUrl: './trip-form.html',
  styleUrls: ['./trip-form.css'],
})
export class TripFormComponent implements OnChanges {

  @Input() trip: Trip | null = null;
  @Input() isNew: boolean = true;
  @Input() allDrivers: Driver[] = [];
  @Input() allVehicles: Vehicle[] = [];
  @Input() allTrips: Trip[] = [];

  @Output() saved = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();

  tripForm: FormGroup;
  message = '';

  availableDrivers: Driver[] = [];
  availableVehicles: Vehicle[] = [];

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.tripForm = this.fb.group({
      driverId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      status: ['Scheduled', Validators.required],
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trip'] && this.trip) {
      this.loadTrip(this.trip);
    } else if (!this.trip && this.isNew) {
      this.resetForm();
    }
    this.filterAvailable();
  }

  loadTrip(trip: Trip) {
    this.tripForm.setValue({
      driverId: trip.driverId || '',
      vehicleId: trip.vehicleId || '',
      source: trip.source || '',
      destination: trip.destination || '',
      status: trip.status || 'Scheduled',
    });
    this.setFormControlsByStatus(trip.status);
  }

  resetForm() {
    this.tripForm.reset({
      driverId: '',
      vehicleId: '',
      source: '',
      destination: '',
      status: 'Scheduled',
    });
    this.setFormControlsByStatus('Scheduled');
  }

  filterAvailable() {
    this.availableDrivers = this.api.getAvailableDrivers(this.allTrips, this.allDrivers);
    this.availableVehicles = this.api.getAvailableVehicles(this.allTrips, this.allVehicles);
    if (!this.isNew && this.trip) {
      // Add current driver if missing
      if (this.availableDrivers.findIndex(d => d.driverId === this.trip?.driverId) === -1) {
        const curDriver = this.allDrivers.find(d => d.driverId === this.trip?.driverId);
        if (curDriver) this.availableDrivers.push(curDriver);
      }
      // Add current vehicle if missing
      if (this.availableVehicles.findIndex(v => v.vehicleId === this.trip?.vehicleId) === -1) {
        const curVehicle = this.allVehicles.find(v => v.vehicleId === this.trip?.vehicleId);
        if (curVehicle) this.availableVehicles.push(curVehicle);
      }
    }
  }

  setFormControlsByStatus(status: string) {
    const s = status ? status.toLowerCase() : '';
    if (s === 'ongoing') {
      this.tripForm.get('source')?.disable();
      this.tripForm.get('driverId')?.disable();
      this.tripForm.get('vehicleId')?.disable();
      this.tripForm.get('status')?.enable();
      this.tripForm.get('destination')?.enable();
    } else if (s === 'completed') {
      this.tripForm.disable();
    } else {
      this.tripForm.enable();
    }
  }

  onSubmit() {
    if (this.tripForm.invalid) return;
    const tripData: Trip = {
      tripId: this.trip?.tripId || 0,
      source: this.tripForm.get('source')!.value || '',
      destination: this.tripForm.get('destination')!.value || '',
      status: this.tripForm.get('status')!.value || 'Scheduled',
      driverId: +this.tripForm.get('driverId')!.value || 0,
      vehicleId: +this.tripForm.get('vehicleId')!.value || 0,
    };
    if (this.isNew) {
      this.api.createTrip(tripData).subscribe({
        next: () => {
          this.message = 'Trip created successfully';
          this.saved.emit();
        },
        error: () => (this.message = 'Error creating trip'),
      });
    } else {
      if (!this.trip) return;
      this.api.updateTrip(this.trip.tripId, tripData).subscribe({
        next: () => {
          this.message = 'Trip updated successfully';
          this.saved.emit();
        },
        error: () => (this.message = 'Error updating trip'),
      });
    }
  }

  onDelete() {
    if (this.trip) {
      if (confirm('Are you sure? This will delete the trip.')) {
        this.deleted.emit(this.trip.tripId);
      }
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
