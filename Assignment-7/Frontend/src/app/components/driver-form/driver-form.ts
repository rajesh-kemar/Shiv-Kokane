import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DriverService } from '../../services/driver';
import { Driver } from '../../models/driver.model';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule],
  templateUrl: './driver-form.html',
  styleUrl: './driver-form.css',
})
export class DriverFormComponent implements OnInit {

  driverForm!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    public dialogRef : MatDialogRef<DriverFormComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {driver: Driver | null, isEdit : boolean}
  )
  {
    this.isEdit = data.isEdit;
  }

  ngOnInit(): void {
    this.driverForm = this.fb.group({
      driverId: [this.data.driver?.driverId || 0],
      driverName: [this.data.driver?.driverName || '', Validators.required],
      licenseNumber: [this.data.driver?.licenseNumber || '', Validators.required],
      yearOfExperience: [this.data.driver?.yearOfExperience || 0, [Validators.required, Validators.min(0)]],
      isAvailable: [this.data.driver?.isAvailable ?? true]
    });    
  }

  OnSubmit(): void{
    if (this.driverForm.valid){
      const { driverId, driverName, licenseNumber, yearOfExperience, isAvailable } = this.driverForm.value;
      const driver = { driverId, driverName, licenseNumber, yearOfExperience, isAvailable };

      if (this.isEdit && driverId){
        this.driverService.updateDriver(driverId, driver).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => {
            console.error('Error updating driver:',error);
            alert('Error updating driver');
          }
        });
      }
      else {
        this.driverService.createDriver(driver).subscribe({
          next: () => this.dialogRef.close(true),
          
          error: (error) => {
            console.error('Error creating driver:',error);
            alert('Error creating driver')
          }
        });
      }
    }
  }

  onCancel(): void{
    this.dialogRef.close(false);
  }
}
