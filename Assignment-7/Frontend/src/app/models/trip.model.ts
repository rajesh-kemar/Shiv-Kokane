export interface Trip {
  id?: number;
  driverId: number;
  vehicleId: number;
  source: string;
  destination: string;
  startDate: Date | string;
  endDate: Date | string;
  status: string;
  drivers?: any;
  vehicles?: any;
}