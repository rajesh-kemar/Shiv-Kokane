import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService, Vehicle } from '../api';

@Component({
  selector: 'app-vehicle',
  imports: [CommonModule],
  templateUrl: './vehicle.html',
  styleUrl: './vehicle.css',
})
export class VehicleComponent implements OnInit {

  vehicles : Vehicle[] = [];
  
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getVehicles().subscribe((data) => (this.vehicles = data));
  }

}
