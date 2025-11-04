import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TripService } from '../../services/trip';
import { Trip } from '../../models/trip.model';
import { TripFormComponent } from '../trip-form/trip-form';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './trips.html',
  styleUrl: './trips.css',
})
export class TripsComponent implements OnInit {
  trips: Trip[] = [];
  displayedColumns: string[] = ['id', 'driverId', 'vehicleId', 'source', 'destination', 'startDate', 'endDate', 'status', 'actions'];

  constructor(
    private tripService: TripService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripService.getAllTrips().subscribe({
      next: (data) => {
        this.trips = data;
      },
      error: (error) => {
        console.error('Error loading trips:', error);
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TripFormComponent, {
      width: '600px',
      data: { trip: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTrips();
      }
    });
  }

  openEditDialog(trip: Trip): void {
    const dialogRef = this.dialog.open(TripFormComponent, {
      width: '600px',
      data: { trip: { ...trip }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTrips();
      }
    });
  }

  completeTrip(id: number) {
    this.tripService.completeTrip(id).subscribe({
      next: (res) => {
        console.log('Response:', res);
        const trip = this.trips.find(t => t.id === id);
        if (trip) trip.status = 'Completed';
        alert('Trip marked as completed!');
      },
      error: (err) => {
        console.error('Error completing trip:', err);
        alert('Failed to complete trip');
      }
    });
  }


  deleteTrip(id: number): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.tripService.deleteTrip(id.toString()).subscribe({
        next: () => {
          this.loadTrips();
        },
        error: (error) => {
          console.error('Error deleting trip:', error);
          alert('Error deleting trip');
        }
      });
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleString();
  }
}