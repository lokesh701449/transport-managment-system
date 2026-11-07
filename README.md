# LogiTrack TMS — Enterprise Fleet Operations Dashboard

A modern, responsive, single-page Transport Management System (TMS) Fleet Operations Dashboard built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Lucide icons**.

Designed for enterprise freight logistics teams managing multi-axle trucks, trailers, refrigerated carriers, and container lorries operating along major interstate freight corridors (e.g., NH-65 Hyderabad–Vijayawada, NH-44 Hyderabad–Bengaluru, NH-16 Vijayawada–Visakhapatnam Port).

---

## Key Modules & Capabilities

### 1. Top-Level Fleet Summary (KPI Metric Cards)
- **Total Fleet Size**: Total inventory, loading dock count, and percentage fleet capacity utilization.
- **Active / In-Transit**: Live running trucks with real-time average highway speed calculation.
- **Idle / Available**: Lorries parked in depot yards awaiting consignment assignment.
- **Maintenance / Out-of-Service**: Grounded vehicles undergoing diagnostic triage or preventative maintenance.
- **Critical Alerts**: Real-time counter for overdue vehicle fitness certifications, PUC expiry, breakdown reports, and low fuel warnings.
- **Interactive KPI Filtering**: Clicking any metric card instantly filters the fleet roster below.

### 2. Lorry / Fleet Roster Table & Visual Grid View
- **Dual View Modes**: Seamless toggle between an enterprise high-density Data Table and visual Telemetry Cards.
- **Complete Attributes**:
  - Vehicle ID & License Plate (e.g., `TRK-1042 / AP 16 TY 8821`)
  - Vehicle Type & Payload capacity / current load
  - High-contrast color-coded status badges: `Running` (Green), `Idle` (Amber), `Maintenance` (Red), `Loading` (Blue)
  - Assigned Driver with contact details and 1-click VoIP call action
  - Current Trip / Route corridor with visual progress bar and Consignment Reference ID
  - Dynamic Fuel Level indicator (with low-fuel alerts below 20%) and calibrated Odometer reading
  - Live Speedometer & Scheduled ETA readout
- **Search & Sort**: Full-text search across license plates, vehicle models, driver names, and freight corridors. Multi-criteria sorting by ID, payload capacity, fuel percentage, and live speed.

### 3. Live Operations Map (CartoDB Dark Matter)
- High-performance **Leaflet** map rendered with a sleek enterprise dark theme.
- Dynamic vehicle pins color-coded by operational status, with animated pulse waves on running units.
- Active route polylines connecting origin hub ➔ live GPS waypoint ➔ destination terminal.
- Interactive pin popups displaying current velocity, progress percentage, ETA, and direct driver call buttons.
- On-map quick filters: "All Units", "Running Only", "Alerts Only", and "Idle Only", plus "Fit Bounds" auto-centering.

### 4. Trip & Dispatch Quick Modal
- "New Trip Dispatch" modal with smart validation.
- Select from idle trucks only (prevents accidental double dispatch).
- Assign licensed commercial pilots filtered by duty clearance.
- Consignment Reference generator and cargo payload limit validation (prevents vehicle overweight violations).
- One-click corridor presets (Hyderabad ➔ Vijayawada, Hyderabad ➔ Bengaluru, Vijayawada ➔ Vizag Port).
- Real-time local state update transitioning the selected lorry from `idle` to `running`.

### 5. Vehicle Details & Maintenance Slide-over Drawer
- Triggered by clicking any vehicle row, card, or map pin.
- **Overview Tab**:
  - Engine powertrain diagnostics (Health status, Coolant temperature in °C, Battery voltage in V).
  - Payload capacity utilization progress bar.
  - Interactive multi-axle Tire Pressure Monitoring System (TPMS) schematic (Front steer axle & rear dual-drive axles).
  - Statutory compliance cards for Comprehensive Insurance, Annual Fitness Certificate (Form 38), and BS-VI Pollution Under Control (PUC) with overdue alert countdowns.
- **Trip History Tab**: Historical log of last 5 completed freight runs with distance (km), transit duration (hrs), diesel fuel consumed (L), timestamps, and driver names.
- **Maintenance Log Tab**: Scheduled service logs, diagnostic work orders, costs in INR (`₹`), and action buttons:
  - *"Send to Maintenance"* for grounding vehicles.
  - *"Mark Repaired & Release to Fleet"* for returning serviced trucks to active standby.

### 6. Interactive VoIP Tele-Dispatch Simulation
- Clicking any "Call Driver" button opens an authentic telecommunications modal with ringing animation, audio waveform visualizer, mute controls, and call duration timer.

### 7. Simulated Real-Time Telemetry Engine
- Background simulation subtly fluctuates speedometers (+/- 1-3 km/h), increments odometers, advances route waypoints, and adjusts fuel levels.
- Operator play/pause toggle in the top header with live GPS sync frequency indicator.

---

## File Structure

```
├── index.html                  # HTML entry point with dark mode class & Google Fonts
├── package.json                # Dependencies: React 18, TypeScript, Tailwind, Lucide, Leaflet
├── tailwind.config.js          # Brand colors, dark mode styling, and animations
├── tsconfig.json               # TypeScript strict configuration
├── vite.config.ts              # Vite configuration
└── src/
    ├── main.tsx                # Application entry mount point
    ├── App.tsx                 # Root coordinator, master state & real-time simulation loop
    ├── index.css               # Tailwind directives & custom Leaflet dark styles
    ├── types/
    │   └── index.ts            # TypeScript interfaces (Vehicle, Driver, Trip, Alert, etc.)
    ├── data/
    │   └── mockData.ts         # High-fidelity dataset for Indian freight transport corridors
    ├── utils/
    │   └── formatters.ts       # Currency (INR), distance (km), date, and status helpers
    └── components/
        ├── layout/
        │   ├── Header.tsx      # Enterprise header, clock, live simulation toggle, dispatch CTA
        │   └── Sidebar.tsx     # Collapsible navigation sidebar (Dashboard, Fleet, Map, Trips, etc.)
        ├── kpi/
        │   └── FleetMetricsCards.tsx # Top-level 5-card metric summary
        ├── fleet/
        │   └── FleetRoster.tsx # Table & Visual Grid view with search/sort
        ├── map/
        │   └── LiveOperationsMap.tsx # Leaflet map with truck markers & route paths
        ├── modals/
        │   ├── DispatchModal.tsx    # Modal to create and dispatch new cargo runs
        │   └── DriverCallModal.tsx  # Interactive VoIP radio/call simulation
        ├── drawer/
        │   └── VehicleDetailsDrawer.tsx # Slide-over overview, history & maintenance tabs
        ├── views/
        │   ├── ActiveTripsView.tsx  # Dedicated in-transit manifest monitoring view
        │   ├── DriversView.tsx      # Pilot personnel directory and rating scores
        │   ├── MaintenanceView.tsx  # Workshop bays, repairs & overdue inspection triage
        │   └── ReportsView.tsx      # Fleet fuel economy, ton-km corridor volume & SLAs
        └── common/
            └── Toast.tsx            # Toast notification container for operational events
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run

1. Clone or navigate to the project directory:
   ```bash
   cd "Transport Managment"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Build production bundle:
   ```bash
   npm run build
   ```
