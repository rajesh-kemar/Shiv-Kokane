import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VehicleService } from '../../services/vehicle';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.css',
})
export class VehicleFormComponent implements OnInit {
  vehicleForm!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    public dialogRef: MatDialogRef<VehicleFormComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: { vehicle: Vehicle | null, isEdit: boolean }
  ) { 
    this.isEdit = data.isEdit;
  }

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      vehicleId: [this.data.vehicle?.vehicleId || 0],
      vehicleNumber: [this.data.vehicle?.vehicleNumber || '', Validators.required],
      vehicleType: [this.data.vehicle?.vehicleType || '', Validators.required],
      vehicleModel: [this.data.vehicle?.vehicleModel || '', Validators.required],
      isAvailable: [this.data.vehicle?.isAvailable ?? true]
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.valid) {
      const vehicle: Vehicle = this.vehicleForm.value;
      
      if (this.isEdit && vehicle.vehicleId) {
        this.vehicleService.updateVehicle(vehicle.vehicleId, vehicle).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating vehicle:', error);
            alert('Error updating vehicle');
          }
        });
      } else {
        this.vehicleService.createVehicle(vehicle).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating vehicle:', error);
            alert('Error creating vehicle');
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
