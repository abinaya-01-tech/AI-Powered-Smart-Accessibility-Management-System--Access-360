# AI-Powered Smart Accessibility Management System
## Full-Stack Installation, Configuration, & Testing Guide

This comprehensive guide explains how to configure, run, and test each component of the **AI-Powered Smart Accessibility Management System**:
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js REST API
- **AI & Computer Vision**: Python 3.10+ + OpenCV + YOLOv8/v11
- **Database & Auth**: Firebase Firestore + Firebase Authentication (with robust in-memory seed service fallback)
- **Geospatial Maps**: OpenStreetMap (Leaflet) + Google Maps Platform

---

### Project Directory Structure
```
ai-accessibility-system/
├── package.json                   # Root unified dev & build scripts
├── server.ts                      # Express server with Vite middleware integration
├── metadata.json                  # Applet configuration & permissions
├── firestore.rules                # Role-Based Access Control security rules
├── firebase-blueprint.json        # Database collection schemas & sample data
├── SETUP_GUIDE.md                 # System documentation & execution guide
├── index.html                     # HTML5 entry point with Leaflet styling
│
├── server/                        # Express backend service
│   ├── server.js                  # Standalone backend entry point
│   ├── package.json               # Backend dependencies
│   ├── routes/
│   │   ├── auth.ts                # Authentication & demo account switcher
│   │   ├── wheelchair.ts          # Cryptographic token issue, verify & revoke
│   │   ├── accessibility.ts       # Image upload & YOLO audit reports
│   │   ├── locations.ts           # Geospatial facilities & feature filters
│   │   └── admin.ts               # Analytics, KPI metrics & compliance charts
│   └── services/
│       ├── firebase.ts            # Firestore persistence & seed data
│       ├── tokenService.ts        # Cryptographically secure random token engine
│       └── aiService.ts           # Python AI proxy with transparent DEMO MODE fallback
│
├── ai-service/                    # Python Computer Vision & YOLO service
│   ├── app.py                     # Flask REST API (:5001)
│   ├── detector.py                # YOLO inference & OpenCV bounding box rendering
│   ├── scorer.py                  # Transparent, explainable accessibility scoring
│   ├── requirements.txt           # Python dependencies (ultralytics, opencv-python, flask)
│   └── models/
│       ├── README.md              # Instructions for attaching custom trained weights
│       └── best.pt                # (Optional) Trained YOLO weights file
│
└── src/                           # React frontend application
    ├── App.tsx                    # Main layout & path routing
    ├── main.tsx                   # React root mount
    ├── types.ts                   # Unified TypeScript schemas
    ├── services/api.ts            # Typed REST API client
    ├── context/
    │   ├── AuthContext.tsx        # User session & role switcher
    │   └── AccessibilitySettingsContext.tsx # High-contrast mode & font scaling
    ├── components/
    │   ├── Navbar.tsx             # Government header with role switcher
    │   ├── Footer.tsx             # Public disclaimer & standards compliance
    │   ├── InteractiveMap.tsx     # Leaflet OpenStreetMap interactive layer
    │   ├── ScoreBadge.tsx         # Accessible score meter & category indicator
    │   └── QRCodeModal.tsx        # Zero-PII QR code modal
    └── pages/
        ├── HomePage.tsx           # Institutional overview & portal selector
        ├── MapPage.tsx            # Facilities discovery with feature filters
        ├── WheelchairTokenPage.tsx # Digital pass, QR code, and token revocation
        ├── VerifyTokenPage.tsx    # Universal facility verification terminal
        ├── AnalyzePage.tsx        # Inspector AI image upload & YOLO scoring
        ├── AdminDashboard.tsx     # Authority analytics & Recharts compliance charts
        ├── AdminReportsPage.tsx   # Audit report dossiers & historical logs
        ├── AdminUsersPage.tsx     # Municipal registry & real-time telemetry
        ├── UserDashboard.tsx      # Wheelchair user personalized dashboard
        ├── LoginPage.tsx          # Authentication portal
        └── RegisterPage.tsx       # Account creation
```

---

### Step 1: Running the Unified Full-Stack Application

The root application is configured to run the Express backend and Vite frontend together:

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
The application will be accessible at: `http://localhost:3000`.

---

### Step 2: Running the Python AI / YOLO Service

The Python AI service handles image detection and visual annotation.

1. Navigate to the `ai-service/` folder:
```bash
cd ai-service
```

2. Create and activate a Python virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install required packages:
```bash
pip install -r requirements.txt
```

4. (Optional) Place your trained model weights:
Place your YOLOv8/v11 weights file named `best.pt` inside:
`ai-service/models/best.pt`

5. Start the Flask AI server:
```bash
python app.py
```
The AI service runs on `http://localhost:5001`.

> **Note on Demo Mode:** If `best.pt` is not present, or if the Python service is offline, the system automatically runs in **DEMO MODE — AI MODEL NOT CONNECTED**, providing explainable scoring and sample detections for smooth academic presentations.

---

### Step 3: Firebase Configuration (Optional)

To connect your own Google Cloud Firebase project:
1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Firestore Database** and **Firebase Authentication** (Email/Password).
3. Copy your project configuration to `.env`:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```
4. Deploy security rules:
`firestore.rules` is included in the project root with RBAC rules for Wheelchair Users, Inspectors, and Admins.

---

### Step 4: Step-by-Step Testing Procedures

#### Test 1: Wheelchair User Pass & QR Generation
1. In the header bar, click **"User"** under Demo Role.
2. Navigate to **"My Wheelchair Token"**.
3. Confirm the active token `WAT-7X92-KL8P-QM41` is displayed.
4. Click **"Show QR Code Pass"** to verify zero-PII QR code rendering.
5. Click **"Reissue New Token"** to test cryptographic token rotation.

#### Test 2: Facility Gateway Verification
1. Navigate to **"Verify Pass"**.
2. Click any of the test presets:
   - **Active Token**: Returns `✓ ACCESS GRANTED` in green with audit log recorded.
   - **Expired Token**: Returns `✗ TOKEN EXPIRED` in amber.
   - **Revoked Token**: Returns `✗ TOKEN REVOKED` in red.
3. Check the access log under **"User Registry"** -> **"All Facility Access Logs"**.

#### Test 3: Inspector AI Image Verification
1. In the header bar, click **"Inspector"** under Demo Role.
2. Navigate to **"AI Image Inspection"**.
3. Choose a sample inspection preset (e.g. *Campus Ramp & Handrail* or *Steep Heritage Stairs*).
4. Click **"Analyze Accessibility Infrastructure"**.
5. Observe:
   - Model Status badge (`REAL AI RESULT` or `DEMO MODE`).
   - Detected objects table with confidence percentages.
   - Transparent score formula walkthrough.
   - Actionable engineering recommendations.
6. Click **"Save Official Report to Firestore"**.

#### Test 4: Geospatial Navigation & Filters
1. Navigate to **"Accessible Map"**.
2. Toggle amenities: **Ramp**, **Elevator / Lift**, **Accessible Restroom**, **Handrail**.
3. Click on any facility marker to open the inspection details card.
4. Click **"Google Maps Route"** to launch external directions.

#### Test 5: Government Authority Monitoring
1. In the header bar, click **"Admin"** under Demo Role.
2. Navigate to **"Government Dashboard"**.
3. Review:
   - Real-time KPI cards (Total Locations, High, Accessible, Partial, Poor).
   - Recharts Visualizations (Score Distribution, Category Pie Chart, Compliance %, 7-Day Access Telemetry).
   - Flagged problematic locations requiring municipal retrofits.
4. Open **"Audit Reports"** to view saved compliance dossiers.
