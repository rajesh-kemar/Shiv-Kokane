import { Component } from '@angular/core';
import { DriverComponent } from './driver/driver';
import { VehicleComponent } from './vehicle/vehicle';
import { TripListComponent } from './trip-list/trip-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DriverComponent, VehicleComponent, TripListComponent],
  template: `
    <h1>Trip Management System</h1>
    <div style="display:flex; gap:20px;">
      <div style="flex:1;"><app-driver></app-driver></div>
      <div style="flex:1;"><app-vehicle></app-vehicle></div>
    </div>
    <hr />
    <app-trip-list></app-trip-list>
  `,
})
export class AppComponent {}
