import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService, Driver } from '../api';

@Component({
  selector: 'app-driver',
  imports: [CommonModule],
  templateUrl: './driver.html',
  styleUrl: './driver.css',
})
export class DriverComponent implements OnInit {

  drivers : Driver[] = [];

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.getDrivers().subscribe((data) => (this.drivers = data));
  }

}
