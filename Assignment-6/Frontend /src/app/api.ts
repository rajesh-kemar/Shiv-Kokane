import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Driver{
  driverId : number;
  driverName: string;
}

export interface Vehicle{
  vehicleId: number;
  vehicleNumber: string;
  type:string;
  vehicleModel: string;
}

export interface Trip{
  tripId: number;
  source: string;
  destination:string;
  status:string;
  driverId:number;
  vehicleId: number;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5269/api'

  constructor(private http: HttpClient) {}


  // Drivers
  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.baseUrl}/drivers`);
  }

  // Vehicles
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles`);
  }

  // Trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips`);
  }

  createTrip(trip: Trip) {
    return this.http.post<Trip>(`${this.baseUrl}/trips/addtrip`, trip);
  }

  updateTrip(id: number, trip: Trip) {
    return this.http.put(`${this.baseUrl}/trips/updatetrip?id=${id}`, trip);
  }

  deleteTrip(id: number) {
    return this.http.delete<any>(`${this.baseUrl}/trips/deletetrip?id=${id}`);
  }

  // Available drivers - filter drivers assigned only to non-completed trips
  getAvailableDrivers(trips: Trip[], allDrivers: Driver[]) : Driver[] {
    const assignedDriverIds = trips
      .filter(t => t.status.toLowerCase() !== 'completed')
      .map(t => t.driverId);
    return allDrivers.filter(d => !assignedDriverIds.includes(d.driverId));
  }

  // Available vehicles - filter vehicles assigned only to non-completed trips
  getAvailableVehicles(trips: Trip[], allVehicles: Vehicle[]) : Vehicle[] {
    const assignedVehicleIds = trips
      .filter(t => t.status.toLowerCase() !== 'completed')
      .map(t => t.vehicleId);
    return allVehicles.filter(v => !assignedVehicleIds.includes(v.vehicleId));
  }
  

}
