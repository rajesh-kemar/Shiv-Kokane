import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = 'http://localhost:5098/api/Drivers';

  constructor(private http : HttpClient){}

  getAllDrivers(): Observable<Driver[]>{
    return this.http.get<Driver[]>(this.apiUrl);
  }
  
  getDriverById(id:number): Observable<Driver>{
    return this.http.get<Driver>(this.apiUrl +'/GetbyId?=' +id);
  } 
  
  createDriver(driver: Driver): Observable<Driver>{
    return this.http.post<Driver>(this.apiUrl,driver);
  }

  updateDriver(id:number, driver:Driver) : Observable<any>{
    return this.http.put(this.apiUrl+'/UpdateDrivers?id='+id,driver);
  }

  deleteDriver(id:number):Observable<any>{
    return this.http.delete(this.apiUrl +'/DeleteDrivers?id=' +id);
  }
}
