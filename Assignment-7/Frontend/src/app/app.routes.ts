import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { DriversComponent } from './components/drivers/drivers';
import { VehiclesComponent } from './components/vehicles/vehicles';
import { TripsComponent } from './components/trips/trips';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'drivers', component: DriversComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'trips', component: TripsComponent }
];