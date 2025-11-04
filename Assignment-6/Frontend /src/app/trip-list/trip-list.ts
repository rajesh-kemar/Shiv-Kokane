// import { TripForm } from './../trip-form/trip-form';
import { ApiService, Driver, Trip, Vehicle } from './../api';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TripFormComponent } from "../trip-form/trip-form";


@Component({
  selector: 'app-trip-list',
  imports: [CommonModule, TripFormComponent],
  templateUrl: './trip-list.html',
  styleUrls: ['./trip-list.css'],  // Note: plural and correct property name
})
export class TripListComponent implements OnInit {

  trips: Trip[] = [];
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];

  showForm = false;
  isNewTrip = true;
  selectedTrip: Trip |null = null;

  message = '';

  constructor(private api: ApiService) {}
    
  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(){
    this.api.getTrips().subscribe((t) => (this.trips = t));
    this.api.getDrivers().subscribe((d) => (this.drivers = d));
    this.api.getVehicles().subscribe((v) => (this.vehicles = v));
  }

   openNewTripForm() {
    this.isNewTrip = true;
    this.selectedTrip = null;
    this.showForm = true;
  }

   openEditForm(trip: Trip) {
    if (trip.status.toLowerCase() === 'completed') {
      alert('Completed trips cannot be edited.');
      return;
    }
    this.isNewTrip = false;
    // Clone to avoid 2-way edit before save
    this.selectedTrip = { ...trip };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.message = '';
  }

  // Called from form component events
  onSaved() {
    this.refreshData();
    this.closeForm();
  }

  onDeleted(id:number){
    this.api.deleteTrip(id).subscribe(
      (res) => {
        this.refreshData();
        this.closeForm();
        this.message = 'Trip Deleted Successfully';
      },
      (err) => {
        this.message = 'Error Deleting Trip';
      }
    )
        




    // ({
    //   next: () => {
    //     this.message = 'Trip Deleted Successfully';
    //     this.refreshData();
    //     this.closeForm();
    //   },
    //   error : () => {
    //     this.message = 'Error Deleting Trip';
    //   },
    // });
  }

}
