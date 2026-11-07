export type VehicleStatus = 'running' | 'idle' | 'maintenance' | 'loading';

export interface VehicleAlert {
  id: string;
  type: 'breakdown' | 'overdue_inspection' | 'low_fuel' | 'overspeed' | 'tire_pressure';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  dutyStatus: 'On Duty' | 'Off Duty' | 'Resting' | 'Awaiting Assignment';
  rating: number;
  totalTrips: number;
  experienceYears: number;
  assignedVehicleId?: string;
  hoursDrivenToday?: number; // Driving tachograph hours (out of 8.0 hrs max)
}

export interface TollPlaza {
  id: string;
  name: string;
  highway: string;
  coordinates: [number, number];
  tollFeeCommercialINR: number;
  status: 'FASTag Active' | 'Congestion Warning' | 'Clear Passage';
  lastPassageTime?: string;
}

export interface CompletedTrip {
  id: string;
  route: string;
  origin: string;
  destination: string;
  distanceKm: number;
  durationHours: number;
  completedAt: string;
  fuelConsumedLiters: number;
  driverName: string;
  status: 'Delivered' | 'Returned';
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'Scheduled Service' | 'Brake Overhaul' | 'Engine Diagnostic' | 'Tire Replacement' | 'Electrical' | 'Suspension Tuning';
  cost: number;
  workshop: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  notes: string;
}

export interface Trip {
  tripId: string;
  consignmentRef: string;
  cargoDescription: string;
  cargoWeightTons: number;
  origin: string;
  destination: string;
  originCoords: [number, number]; // [lat, lng]
  destinationCoords: [number, number]; // [lat, lng]
  currentCoords: [number, number]; // [lat, lng]
  departureTime: string;
  estimatedArrival: string;
  progressPercent: number;
  routeWaypoints: [number, number][];
}

export interface TireMetrics {
  frontLeft: number;
  frontRight: number;
  rearLeft1: number;
  rearRight1: number;
  rearLeft2: number;
  rearRight2: number;
}

export interface Vehicle {
  id: string; // e.g. "TRK-1042"
  plate: string; // e.g. "AP 16 TY 8821"
  model: string; // e.g. "Tata Signa 4825.TK"
  type: '24-ft Container' | '32-ft Multi-Axle' | 'Open Body Flatbed' | 'Refrigerated Carrier' | 'Liquid Tanker';
  payloadCapacityTons: number;
  currentPayloadTons: number;
  status: VehicleStatus;
  driver: Driver | null;
  currentTrip: Trip | null;
  fuelPercent: number; // 0 - 100
  odometerKm: number;
  liveSpeedKmh: number;
  coordinates: [number, number]; // [lat, lng]
  heading: number; // 0-360 degrees
  engineStatus: 'Optimal' | 'Warning' | 'Overheating' | 'Off';
  coolantTempC: number;
  batteryVoltage: number;
  tirePressurePsi: TireMetrics;
  insuranceExpiry: string;
  fitnessCertExpiry: string;
  pollutionCertExpiry: string;
  lastServiceDate: string;
  nextServiceKm: number;
  alerts: VehicleAlert[];
  tripHistory: CompletedTrip[];
  maintenanceLogs: MaintenanceRecord[];
  fastTagBalance?: number; // FASTag prepaid balance in INR
}

export type ViewMode = 'table' | 'grid';

export interface DispatchFormData {
  vehicleId: string;
  driverId: string;
  consignmentRef: string;
  cargoDescription: string;
  cargoWeightTons: number;
  origin: string;
  destination: string;
  departureTime: string;
  estimatedArrival: string;
}

export interface FleetMetrics {
  totalTrucks: number;
  runningTrucks: number;
  idleTrucks: number;
  maintenanceTrucks: number;
  loadingTrucks: number;
  criticalAlertsCount: number;
  fleetUtilizationRate: number;
  avgFuelEfficiencyKmpl: number;
  onTimeDeliveryRate: number;
}

