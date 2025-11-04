import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:5098/api/Trips';

  constructor(private http: HttpClient) { }

  getAllTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/GetById?id=${id}`);
  }

  createTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }

  updateTrip(id: number, trip: Trip): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateTrip?id=${id}`, {});
  }

  completeTrip(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/CompleteTrip?id=${id}`, {});
  }

  deleteTrip(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteTrip?id=${id}`);
  }

  getLongTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/LongTrips`);
  }
}