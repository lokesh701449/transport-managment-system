import { Vehicle, Driver, VehicleAlert, MaintenanceRecord, CompletedTrip } from '../types';

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'DRV-101',
    name: 'Ramesh Naidu',
    phone: '+91 98480 23411',
    licenseNumber: 'AP-16-2014-0038921',
    dutyStatus: 'On Duty',
    rating: 4.85,
    totalTrips: 342,
    experienceYears: 11,
    assignedVehicleId: 'TRK-1042'
  },
  {
    id: 'DRV-102',
    name: 'Suresh Kumar Reddy',
    phone: '+91 94401 89204',
    licenseNumber: 'TS-09-2016-0044190',
    dutyStatus: 'On Duty',
    rating: 4.92,
    totalTrips: 410,
    experienceYears: 14,
    assignedVehicleId: 'TRK-1088'
  },
  {
    id: 'DRV-103',
    name: 'Mohammed Irfan',
    phone: '+91 98855 67123',
    licenseNumber: 'MH-12-2018-0091244',
    dutyStatus: 'Awaiting Assignment',
    rating: 4.74,
    totalTrips: 215,
    experienceYears: 7,
  },
  {
    id: 'DRV-104',
    name: 'Gurpreet Singh Gill',
    phone: '+91 98140 55198',
    licenseNumber: 'PB-10-2012-0012903',
    dutyStatus: 'Awaiting Assignment',
    rating: 4.90,
    totalTrips: 520,
    experienceYears: 16,
  },
  {
    id: 'DRV-105',
    name: 'Venkat Rao V.',
    phone: '+91 91772 34091',
    licenseNumber: 'AP-31-2017-0077812',
    dutyStatus: 'On Duty',
    rating: 4.65,
    totalTrips: 180,
    experienceYears: 6,
    assignedVehicleId: 'TRK-2015'
  },
  {
    id: 'DRV-106',
    name: 'Anil Varma',
    phone: '+91 99890 12845',
    licenseNumber: 'KA-05-2015-0066231',
    dutyStatus: 'Awaiting Assignment',
    rating: 4.88,
    totalTrips: 290,
    experienceYears: 9,
  },
  {
    id: 'DRV-107',
    name: 'Prakash Patil',
    phone: '+91 97654 32109',
    licenseNumber: 'MH-14-2013-0055410',
    dutyStatus: 'Resting',
    rating: 4.70,
    totalTrips: 375,
    experienceYears: 12,
  },
  {
    id: 'DRV-108',
    name: 'Balaji Natarajan',
    phone: '+91 94440 76543',
    licenseNumber: 'TN-01-2019-0033871',
    dutyStatus: 'On Duty',
    rating: 4.81,
    totalTrips: 160,
    experienceYears: 5,
    assignedVehicleId: 'TRK-1092'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'TRK-1042',
    plate: 'AP 16 TY 8821',
    model: 'Tata Signa 4825.TK Heavy Hauler',
    type: '24-ft Container',
    payloadCapacityTons: 16.0,
    currentPayloadTons: 14.2,
    status: 'running',
    driver: INITIAL_DRIVERS[0],
    currentTrip: {
      tripId: 'TRP-8831',
      consignmentRef: 'CN-89421-HYD-VJA',
      cargoDescription: 'Consumer Electronics & FMCG Pallets',
      cargoWeightTons: 14.2,
      origin: 'Hyderabad Hub (Shamshabad)',
      destination: 'Vijayawada Logistics Park (Gannavaram)',
      originCoords: [17.2403, 78.4294],
      destinationCoords: [16.5318, 80.7967],
      currentCoords: [16.9240, 79.9450], // Mid-route near Suryapet/Kodad
      departureTime: 'Today, 06:30 AM',
      estimatedArrival: 'Today, 02:45 PM',
      progressPercent: 68,
      routeWaypoints: [
        [17.2403, 78.4294],
        [17.1500, 79.1000],
        [17.1439, 79.6239], // Suryapet
        [16.9240, 79.9450], // Current
        [16.7100, 80.3500], // Nandigama
        [16.5318, 80.7967]  // Vijayawada
      ]
    },
    fuelPercent: 64,
    odometerKm: 142850,
    liveSpeedKmh: 68,
    coordinates: [16.9240, 79.9450],
    heading: 115,
    engineStatus: 'Optimal',
    coolantTempC: 86,
    batteryVoltage: 24.4,
    tirePressurePsi: {
      frontLeft: 110,
      frontRight: 112,
      rearLeft1: 118,
      rearRight1: 117,
      rearLeft2: 120,
      rearRight2: 119
    },
    insuranceExpiry: '2027-04-18',
    fitnessCertExpiry: '2027-09-12',
    pollutionCertExpiry: '2027-03-30',
    lastServiceDate: '2026-09-15',
    nextServiceKm: 150000,
    alerts: [
      {
        id: 'ALT-101',
        type: 'overspeed',
        severity: 'info',
        message: 'Briefly hit 74 km/h on NH-65 downhill stretch (Speed limit 70 km/h)',
        timestamp: '18 mins ago'
      }
    ],
    tripHistory: [
      {
        id: 'TH-501',
        route: 'Vijayawada -> Hyderabad',
        origin: 'Vijayawada',
        destination: 'Hyderabad',
        distanceKm: 275,
        durationHours: 6.2,
        completedAt: 'Yesterday, 10:30 PM',
        fuelConsumedLiters: 82,
        driverName: 'Ramesh Naidu',
        status: 'Delivered'
      },
      {
        id: 'TH-502',
        route: 'Hyderabad -> Kurnool',
        origin: 'Hyderabad',
        destination: 'Kurnool',
        distanceKm: 218,
        durationHours: 4.8,
        completedAt: 'Nov 04, 2026',
        fuelConsumedLiters: 65,
        driverName: 'Ramesh Naidu',
        status: 'Delivered'
      },
      {
        id: 'TH-503',
        route: 'Kurnool -> Hyderabad',
        origin: 'Kurnool',
        destination: 'Hyderabad',
        distanceKm: 218,
        durationHours: 5.1,
        completedAt: 'Nov 03, 2026',
        fuelConsumedLiters: 66,
        driverName: 'Ramesh Naidu',
        status: 'Delivered'
      },
      {
        id: 'TH-504',
        route: 'Hyderabad -> Bengaluru',
        origin: 'Hyderabad',
        destination: 'Bengaluru',
        distanceKm: 570,
        durationHours: 11.5,
        completedAt: 'Oct 30, 2026',
        fuelConsumedLiters: 172,
        driverName: 'Ramesh Naidu',
        status: 'Delivered'
      },
      {
        id: 'TH-505',
        route: 'Bengaluru -> Hyderabad',
        origin: 'Bengaluru',
        destination: 'Hyderabad',
        distanceKm: 570,
        durationHours: 12.0,
        completedAt: 'Oct 28, 2026',
        fuelConsumedLiters: 175,
        driverName: 'Ramesh Naidu',
        status: 'Delivered'
      }
    ],
    maintenanceLogs: [
      {
        id: 'ML-901',
        date: '2026-09-15',
        type: 'Scheduled Service',
        cost: 24500,
        workshop: 'Tata Authorized Service Hub, Hyderabad Central',
        status: 'Completed',
        notes: 'Mobil Delvac oil replacement, fuel filter & air filter change, wheel alignment done.'
      },
      {
        id: 'ML-902',
        date: '2026-06-10',
        type: 'Brake Overhaul',
        cost: 16800,
        workshop: 'Apex Commercial Garages, Autonagar, Guntur',
        status: 'Completed',
        notes: 'Front and rear brake pad liners replaced, pneumatic valve calibrated.'
      }
    ]
  },
  {
    id: 'TRK-1088',
    plate: 'TS 09 UB 4512',
    model: 'BharatBenz 2823R Heavy Truck',
    type: '32-ft Multi-Axle',
    payloadCapacityTons: 21.0,
    currentPayloadTons: 19.5,
    status: 'running',
    driver: INITIAL_DRIVERS[1],
    currentTrip: {
      tripId: 'TRP-8839',
      consignmentRef: 'CN-90412-BLR-CHE',
      cargoDescription: 'Precision Automotive Castings & Spare Parts',
      cargoWeightTons: 19.5,
      origin: 'Bengaluru Electronic City Logistics',
      destination: 'Chennai Port Container Freight Station',
      originCoords: [12.8452, 77.6602],
      destinationCoords: [13.0827, 80.2707],
      currentCoords: [12.9150, 79.1325], // Near Vellore
      departureTime: 'Today, 04:15 AM',
      estimatedArrival: 'Today, 01:30 PM',
      progressPercent: 55,
      routeWaypoints: [
        [12.8452, 77.6602],
        [12.8340, 78.1000],
        [12.9150, 79.1325],
        [13.0100, 79.8500],
        [13.0827, 80.2707]
      ]
    },
    fuelPercent: 42,
    odometerKm: 98410,
    liveSpeedKmh: 61,
    coordinates: [12.9150, 79.1325],
    heading: 85,
    engineStatus: 'Optimal',
    coolantTempC: 84,
    batteryVoltage: 25.1,
    tirePressurePsi: {
      frontLeft: 115,
      frontRight: 114,
      rearLeft1: 122,
      rearRight1: 121,
      rearLeft2: 124,
      rearRight2: 123
    },
    insuranceExpiry: '2027-07-22',
    fitnessCertExpiry: '2027-11-05',
    pollutionCertExpiry: '2027-05-14',
    lastServiceDate: '2026-08-20',
    nextServiceKm: 110000,
    alerts: [],
    tripHistory: [
      {
        id: 'TH-506',
        route: 'Chennai -> Bengaluru',
        origin: 'Chennai',
        destination: 'Bengaluru',
        distanceKm: 345,
        durationHours: 7.5,
        completedAt: 'Yesterday, 07:00 PM',
        fuelConsumedLiters: 115,
        driverName: 'Suresh Kumar Reddy',
        status: 'Delivered'
      }
    ],
    maintenanceLogs: [
      {
        id: 'ML-903',
        date: '2026-08-20',
        type: 'Scheduled Service',
        cost: 29800,
        workshop: 'Daimler Truck Center, Hosur',
        status: 'Completed',
        notes: 'Full synthetic fluids swap, AdBlue tank sensor cleaned.'
      }
    ]
  },
  {
    id: 'TRK-2015',
    plate: 'AP 39 Z 9090',
    model: 'Volvo FM 420 4x2 Tractor',
    type: 'Refrigerated Carrier',
    payloadCapacityTons: 18.0,
    currentPayloadTons: 16.8,
    status: 'running',
    driver: INITIAL_DRIVERS[4],
    currentTrip: {
      tripId: 'TRP-8845',
      consignmentRef: 'CN-91220-VJA-VIZ',
      cargoDescription: 'Frozen Marine Export Consignments (-20°C)',
      cargoWeightTons: 16.8,
      origin: 'Vijayawada Cold Storage Facility',
      destination: 'Visakhapatnam Port Cold Berth 4',
      originCoords: [16.5062, 80.6480],
      destinationCoords: [17.6868, 83.2185],
      currentCoords: [17.1000, 81.8000], // Near Rajahmundry
      departureTime: 'Today, 08:00 AM',
      estimatedArrival: 'Today, 04:45 PM',
      progressPercent: 44,
      routeWaypoints: [
        [16.5062, 80.6480],
        [16.7107, 81.0952],
        [17.0005, 81.7800],
        [17.1000, 81.8000],
        [17.3500, 82.5000],
        [17.6868, 83.2185]
      ]
    },
    fuelPercent: 14, // Alert trigger: low fuel
    odometerKm: 215400,
    liveSpeedKmh: 54,
    coordinates: [17.1000, 81.8000],
    heading: 65,
    engineStatus: 'Optimal',
    coolantTempC: 89,
    batteryVoltage: 24.2,
    tirePressurePsi: {
      frontLeft: 112,
      frontRight: 110,
      rearLeft1: 116,
      rearRight1: 115,
      rearLeft2: 118,
      rearRight2: 117
    },
    insuranceExpiry: '2027-01-15',
    fitnessCertExpiry: '2027-06-30',
    pollutionCertExpiry: '2027-01-20',
    lastServiceDate: '2026-10-02',
    nextServiceKm: 220000,
    alerts: [
      {
        id: 'ALT-102',
        type: 'low_fuel',
        severity: 'critical',
        message: 'Fuel level critical: 14% remaining (~48 km range). Recommend refueling at IOCL Diwancheruvu.',
        timestamp: '12 mins ago'
      }
    ],
    tripHistory: [
      {
        id: 'TH-507',
        route: 'Visakhapatnam -> Vijayawada',
        origin: 'Visakhapatnam',
        destination: 'Vijayawada',
        distanceKm: 350,
        durationHours: 8.0,
        completedAt: 'Nov 05, 2026',
        fuelConsumedLiters: 122,
        driverName: 'Venkat Rao V.',
        status: 'Delivered'
      }
    ],
    maintenanceLogs: [
      {
        id: 'ML-904',
        date: '2026-10-02',
        type: 'Engine Diagnostic',
        cost: 14200,
        workshop: 'Volvo Commercial Workshop, Gannavaram',
        status: 'Completed',
        notes: 'Chiller unit auxiliary alternator checked, freon level topped up.'
      }
    ]
  },
  {
    id: 'TRK-1011',
    plate: 'TS 07 UA 3341',
    model: 'Ashok Leyland 2820-6x2 MAV',
    type: 'Open Body Flatbed',
    payloadCapacityTons: 20.0,
    currentPayloadTons: 0,
    status: 'idle',
    driver: null,
    currentTrip: null,
    fuelPercent: 88,
    odometerKm: 65420,
    liveSpeedKmh: 0,
    coordinates: [17.3850, 78.4867], // Hyderabad Depot
    heading: 0,
    engineStatus: 'Off',
    coolantTempC: 32,
    batteryVoltage: 25.4,
    tirePressurePsi: {
      frontLeft: 116,
      frontRight: 116,
      rearLeft1: 120,
      rearRight1: 120,
      rearLeft2: 122,
      rearRight2: 122
    },
    insuranceExpiry: '2027-10-10',
    fitnessCertExpiry: '2027-12-01',
    pollutionCertExpiry: '2027-08-15',
    lastServiceDate: '2026-10-15',
    nextServiceKm: 75000,
    alerts: [],
    tripHistory: [
      {
        id: 'TH-508',
        route: 'Raipur -> Hyderabad',
        origin: 'Raipur',
        destination: 'Hyderabad',
        distanceKm: 550,
        durationHours: 13.0,
        completedAt: 'Nov 05, 2026',
        fuelConsumedLiters: 180,
        driverName: 'Mohammed Irfan',
        status: 'Delivered'
      }
    ],
    maintenanceLogs: [
      {
        id: 'ML-905',
        date: '2026-10-15',
        type: 'Scheduled Service',
        cost: 18400,
        workshop: 'Ashok Leyland Dealer, Sanathnagar',
        status: 'Completed',
        notes: 'Regular 60K service check, grease nipples lubricated, leaf springs tension tested.'
      }
    ]
  },
  {
    id: 'TRK-1077',
    plate: 'AP 29 BD 1109',
    model: 'Eicher Pro 6028TM Haulage',
    type: '24-ft Container',
    payloadCapacityTons: 16.5,
    currentPayloadTons: 0,
    status: 'idle',
    driver: null,
    currentTrip: null,
    fuelPercent: 78,
    odometerKm: 81200,
    liveSpeedKmh: 0,
    coordinates: [16.5062, 80.6480], // Vijayawada Autonagar Hub
    heading: 0,
    engineStatus: 'Off',
    coolantTempC: 30,
    batteryVoltage: 24.8,
    tirePressurePsi: {
      frontLeft: 112,
      frontRight: 112,
      rearLeft1: 118,
      rearRight1: 119,
      rearLeft2: 120,
      rearRight2: 120
    },
    insuranceExpiry: '2027-05-30',
    fitnessCertExpiry: '2027-10-18',
    pollutionCertExpiry: '2027-04-12',
    lastServiceDate: '2026-09-02',
    nextServiceKm: 90000,
    alerts: [],
    tripHistory: [
      {
        id: 'TH-509',
        route: 'Tirupati -> Vijayawada',
        origin: 'Tirupati',
        destination: 'Vijayawada',
        distanceKm: 380,
        durationHours: 8.5,
        completedAt: 'Nov 06, 2026',
        fuelConsumedLiters: 118,
        driverName: 'Gurpreet Singh Gill',
        status: 'Delivered'
      }
    ],
    maintenanceLogs: [
      {
        id: 'ML-906',
        date: '2026-09-02',
        type: 'Suspension Tuning',
        cost: 12300,
        workshop: 'Eicher Service Center, Benz Circle, Vijayawada',
        status: 'Completed',
        notes: 'Rear shock absorber bush replacements and torque tightening.'
      }
    ]
  },
  {
    id: 'TRK-1055',
    plate: 'MH 12 QP 7734',
    model: 'Tata Prima 3530.K Tipper',
    type: 'Open Body Flatbed',
    payloadCapacityTons: 25.0,
    currentPayloadTons: 0,
    status: 'maintenance',
    driver: null,
    currentTrip: null,
    fuelPercent: 35,
    odometerKm: 184900,
    liveSpeedKmh: 0,
    coordinates: [18.5204, 73.8567], // Pune Workshop
    heading: 0,
    engineStatus: 'Warning',
    coolantTempC: 45,
    batteryVoltage: 23.9,
    tirePressurePsi: {
      frontLeft: 104,
      frontRight: 105,
      rearLeft1: 112,
      rearRight1: 108,
      rearLeft2: 114,
      rearRight2: 111
    },
    insuranceExpiry: '2027-03-12',
    fitnessCertExpiry: '2026-11-02', // Overdue inspection alert
    pollutionCertExpiry: '2027-02-18',
    lastServiceDate: '2026-05-18',
    nextServiceKm: 180000,
    alerts: [
      {
        id: 'ALT-103',
        type: 'overdue_inspection',
        severity: 'critical',
        message: 'Vehicle Annual Fitness Certification expired 5 days ago (Nov 02, 2026)',
        timestamp: '1 day ago'
      },
      {
        id: 'ALT-104',
        type: 'breakdown',
        severity: 'critical',
        message: 'Differential gear oil leakage reported; vehicle grounded at Chakan Workshop',
        timestamp: 'Yesterday'
      }
    ],
    tripHistory: [
      {
        id: 'TH-510',
        route: 'Nagpur -> Pune',
        origin: 'Nagpur',
        destination: 'Pune',
        distanceKm: 710,
        durationHours: 16.0,
        completedAt: 'Nov 02, 2026',
        fuelConsumedLiters: 235,
        driverName: 'Prakash Patil',
        status: 'Delivered'
      }
    ],
    maintenanceLogs: [
      {
        id: 'ML-907',
        date: '2026-11-06',
        type: 'Engine Diagnostic',
        cost: 38000,
        workshop: 'Chakan Industrial Truck Care, Pune',
        status: 'In Progress',
        notes: 'Inspecting differential seal rupture, replacement ring gear and bearings ordered.'
      }
    ]
  },
  {
    id: 'TRK-1092',
    plate: 'TN 01 AK 6620',
    model: 'BharatBenz 1617R Medium Carrier',
    type: '24-ft Container',
    payloadCapacityTons: 11.5,
    currentPayloadTons: 8.4,
    status: 'loading',
    driver: INITIAL_DRIVERS[7],
    currentTrip: {
      tripId: 'TRP-8850',
      consignmentRef: 'CN-92100-MAA-HYD',
      cargoDescription: 'Pharmaceutical Medical Supplies & Diagnostics',
      cargoWeightTons: 8.4,
      origin: 'Chennai Guindy Industrial Estate Dock 3',
      destination: 'Hyderabad Genome Valley Biotech Hub',
      originCoords: [13.0067, 80.2023],
      destinationCoords: [17.6534, 78.6012],
      currentCoords: [13.0067, 80.2023],
      departureTime: 'Scheduled: Today, 07:00 PM',
      estimatedArrival: 'Tomorrow, 07:30 AM',
      progressPercent: 5,
      routeWaypoints: [
        [13.0067, 80.2023],
        [13.8000, 80.0000],
        [14.4426, 79.9865],
        [15.8281, 78.0373],
        [17.6534, 78.6012]
      ]
    },
    fuelPercent: 92,
    odometerKm: 54100,
    liveSpeedKmh: 0,
    coordinates: [13.0067, 80.2023],
    heading: 0,
    engineStatus: 'Optimal',
    coolantTempC: 38,
    batteryVoltage: 25.0,
    tirePressurePsi: {
      frontLeft: 114,
      frontRight: 115,
      rearLeft1: 120,
      rearRight1: 120,
      rearLeft2: 121,
      rearRight2: 122
    },
    insuranceExpiry: '2027-11-20',
    fitnessCertExpiry: '2027-12-15',
    pollutionCertExpiry: '2027-09-10',
    lastServiceDate: '2026-10-10',
    nextServiceKm: 65000,
    alerts: [],
    tripHistory: [
      {
        id: 'TH-511',
        route: 'Coimbatore -> Chennai',
        origin: 'Coimbatore',
        destination: 'Chennai',
        distanceKm: 505,
        durationHours: 10.5,
        completedAt: 'Nov 06, 2026',
        fuelConsumedLiters: 145,
        driverName: 'Balaji Natarajan',
        status: 'Delivered'
      }
    ],
    maintenanceLogs: [
      {
        id: 'ML-908',
        date: '2026-10-10',
        type: 'Scheduled Service',
        cost: 16500,
        workshop: 'BharatBenz Dealership, Madhavaram, Chennai',
        status: 'Completed',
        notes: 'First 50,000 km mandatory preventative service inspection.'
      }
    ]
  },
  {
    id: 'TRK-2040',
    plate: 'KA 03 MX 5589',
    model: 'Tata Prima 2830.S Tractor',
    type: 'Liquid Tanker',
    payloadCapacityTons: 22.0,
    currentPayloadTons: 0,
    status: 'maintenance',
    driver: null,
    currentTrip: null,
    fuelPercent: 28,
    odometerKm: 289400,
    liveSpeedKmh: 0,
    coordinates: [12.9716, 77.5946], // Bengaluru Workshop
    heading: 0,
    engineStatus: 'Overheating',
    coolantTempC: 102,
    batteryVoltage: 23.6,
    tirePressurePsi: {
      frontLeft: 106,
      frontRight: 102,
      rearLeft1: 110,
      rearRight1: 112,
      rearLeft2: 114,
      rearRight2: 115
    },
    insuranceExpiry: '2027-02-14',
    fitnessCertExpiry: '2027-04-10',
    pollutionCertExpiry: '2026-11-06', // Alert: PUC expired
    lastServiceDate: '2026-07-28',
    nextServiceKm: 280000,
    alerts: [
      {
        id: 'ALT-105',
        type: 'overdue_inspection',
        severity: 'critical',
        message: 'Pollution Under Control (PUC) expired yesterday (Nov 06, 2026)',
        timestamp: 'Today, 08:00 AM'
      },
      {
        id: 'ALT-106',
        type: 'tire_pressure',
        severity: 'warning',
        message: 'Front-right steer tire pressure degraded to 102 PSI (recommended 115 PSI)',
        timestamp: '3 hours ago'
      }
    ],
    tripHistory: [
      {
        id: 'TH-512',
        route: 'Mangaluru -> Bengaluru',
        origin: 'Mangaluru',
        destination: 'Bengaluru',
        distanceKm: 350,
        durationHours: 9.0,
        completedAt: 'Nov 04, 2026',
        fuelConsumedLiters: 130,
        driverName: 'Anil Varma',
        status: 'Delivered'
      }
    ],
    maintenanceLogs: [
      {
        id: 'ML-909',
        date: '2026-11-07',
        type: 'Electrical',
        cost: 21500,
        workshop: 'Peenya Industrial Fleet Repair, Bengaluru',
        status: 'Scheduled',
        notes: 'Thermostat housing replacement and radiator flushing.'
      }
    ]
  },
  {
    id: 'TRK-3022',
    plate: 'TS 08 KL 1928',
    model: 'Mahindra Blazo X 35 Haulage',
    type: '32-ft Multi-Axle',
    payloadCapacityTons: 24.0,
    currentPayloadTons: 0,
    status: 'idle',
    driver: null,
    currentTrip: null,
    fuelPercent: 82,
    odometerKm: 72150,
    liveSpeedKmh: 0,
    coordinates: [17.4399, 78.4983], // Secunderabad Yard
    heading: 0,
    engineStatus: 'Off',
    coolantTempC: 28,
    batteryVoltage: 25.2,
    tirePressurePsi: {
      frontLeft: 114,
      frontRight: 115,
      rearLeft1: 120,
      rearRight1: 120,
      rearLeft2: 122,
      rearRight2: 121
    },
    insuranceExpiry: '2027-08-19',
    fitnessCertExpiry: '2027-11-25',
    pollutionCertExpiry: '2027-07-14',
    lastServiceDate: '2026-09-28',
    nextServiceKm: 85000,
    alerts: [],
    tripHistory: [
      {
        id: 'TH-513',
        route: 'Vijayawada -> Hyderabad',
        origin: 'Vijayawada',
        destination: 'Hyderabad',
        distanceKm: 275,
        durationHours: 6.0,
        completedAt: 'Nov 06, 2026',
        fuelConsumedLiters: 85,
        driverName: 'Gurpreet Singh Gill',
        status: 'Delivered'
      }
    ],
    maintenanceLogs: [
      {
        id: 'ML-910',
        date: '2026-09-28',
        type: 'Tire Replacement',
        cost: 44000,
        workshop: 'MRF Commercial Tyre Center, Kukatpally',
        status: 'Completed',
        notes: 'Fitted 2 new front steer tires (MRF Super Lug 295/80R22.5).'
      }
    ]
  }
];

export const POPULAR_LOCATIONS = [
  { name: 'Hyderabad Hub (Shamshabad)', coords: [17.2403, 78.4294] as [number, number] },
  { name: 'Vijayawada Logistics Park (Gannavaram)', coords: [16.5318, 80.7967] as [number, number] },
  { name: 'Bengaluru Electronic City Hub', coords: [12.8452, 77.6602] as [number, number] },
  { name: 'Chennai Port Container Freight Station', coords: [13.0827, 80.2707] as [number, number] },
  { name: 'Visakhapatnam Port Berth 4', coords: [17.6868, 83.2185] as [number, number] },
  { name: 'Pune Chakan Industrial Hub', coords: [18.7500, 73.8500] as [number, number] },
  { name: 'Kurnool National Highway Transit', coords: [15.8281, 78.0373] as [number, number] },
  { name: 'Tirupati Cargo Terminal', coords: [13.6288, 79.4192] as [number, number] }
];
