# Project Structure & File Organization

## Complete Frontend Directory Tree

```
Rubiscape/
├── backend/                          # Backend Python/FastAPI code
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   ├── routes/
│   │   │   ├── pipelines.py
│   │   │   ├── audit.py
│   │   │   └── websocket.py
│   │   └── services/
│   └── requirements.txt
├── frontend/                         # React Dashboard Frontend (NEW)
│   ├── public/
│   │   ├── index.html               # Main HTML entry point
│   │   └── favicon.ico
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js             # Login with role selection
│   │   │   ├── ManagerDashboard.js  # Manager dashboard
│   │   │   ├── TeamLeaderDashboard.js  # Team leader dashboard
│   │   │   └── ClientDashboard.js   # Client dashboard (read-only)
│   │   ├── components/
│   │   │   ├── Header.js            # Navigation header
│   │   │   ├── ProtectedRoute.js    # Route protection
│   │   │   └── CSVUploadModal.js    # File upload modal
│   │   ├── context/
│   │   │   └── AuthContext.js       # Authentication state
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.js                   # Main app with routes
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles
│   ├── package.json                 # NPM dependencies
│   ├── .env                         # Environment variables
│   ├── .gitignore                   # Git ignore rules
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── README.md                    # Full documentation
│   ├── SETUP_GUIDE.md              # Quick setup instructions
│   ├── QUICK_REFERENCE.md          # Feature overview
│   └── IMPLEMENTATION_SUMMARY.md   # Technical details
├── Dockerfile                        # Docker image definition
├── docker-compose.yml               # Docker compose config
└── ...other files...
```

## Component Relationships

```
App.js (Router)
├── /login → Login.js
└── /dashboard/:role → ProtectedRoute
    ├── /manager → ManagerDashboard.js
    │   ├── Header (navigation)
    │   ├── Summary Cards (analytics)
    │   ├── Project List
    │   │   ├── Grid View
    │   │   └── List View
    │   └── CSVUploadModal
    ├── /team_leader → TeamLeaderDashboard.js
    │   ├── Header (navigation)
    │   ├── Summary Cards (basic stats)
    │   ├── Project List
    │   │   └── Editable Details
    │   └── CSVUploadModal
    └── /client → ClientDashboard.js
        ├── Header (navigation)
        ├── Summary Cards (read-only)
        └── Project List (expandable, view-only)
```

## State Management Flow

```
AuthContext.js
├── user (current user data)
├── login() → localStorage
├── logout() → clear localStorage
└── useAuth() hook for components

ManagerDashboard.js - Local State
├── projects[] → sample data
├── editingId → current edit
├── editData → form data
├── uploadModal → modal visibility
└── handlers for CRUD

TeamLeaderDashboard.js - Local State
├── projects[] → assigned projects
├── editingId → current edit
├── selectedProject → for upload
└── handlers for edit/upload

ClientDashboard.js - Local State
├── projects[] → view-only data
└── expandedId → expanded project
```

## Data Flow

```
Login
  ↓
AuthContext.login(username, role)
  ↓
localStorage.setItem('user', {...})
  ↓
Navigate to /dashboard/{role}
  ↓
ProtectedRoute checks useAuth()
  ↓
Render corresponding Dashboard
  ↓
Dashboard loads mock projects
  ↓
User interactions (edit, upload, download)
  ↓
Mock data updated locally
  ↓
UI re-renders
```

## File Responsibilities

### Pages (Dashboards)
- **Login.js** - Authentication & role selection
- **ManagerDashboard.js** - Full CRUD for projects, analytics, budgets
- **TeamLeaderDashboard.js** - View, edit, upload for team projects
- **ClientDashboard.js** - Read-only project view & downloads

### Components (Reusable)
- **Header.js** - Navigation, user info, logout button
- **ProtectedRoute.js** - Authorization wrapper for routes
- **CSVUploadModal.js** - File upload with drag-drop

### Context (State)
- **AuthContext.js** - User authentication & session management

### Services (API)
- **api.js** - Axios instance + API endpoint definitions

### Configuration
- **App.js** - React Router setup & route definitions
- **index.js** - React DOM render
- **package.json** - Dependencies list
- **tailwind.config.js** - Tailwind CSS configuration

## CSS/Styling Structure

```
index.css (Global)
├── Tailwind base, components, utilities
├── Scrollbar styling
├── Animation definitions
└── Font/body styling

Component Styles (Inline Tailwind)
├── Header → bg-white, shadow, sticky
├── Dashboard → max-w-7xl, grid layouts
├── Cards → rounded-lg, shadow, p-6
├── Progress Bars → bg-gray-200, overflow-hidden
├── Forms → border, focus:ring, rounded-lg
└── Buttons → bg-{color}-600, hover, transition
```

## Environment Setup

```
.env
├── REACT_APP_API_URL=http://localhost:8000
└── (for production: https://api.example.com)
```

## Build Output

When running `npm build`:
```
build/
├── index.html
├── static/
│   ├── js/
│   │   ├── main.*.js (app code)
│   │   └── *.chunk.js (vendor code)
│   ├── css/
│   │   └── main.*.css (tailwind output)
│   └── media/ (images, fonts)
└── manifest.json
```

## Dependencies Tree

```
react@18.2.0
└── react-dom@18.2.0

react-router-dom@6.0.0
└── (routing & navigation)

axios@1.4.0
└── (HTTP requests)

tailwindcss@3.3.0
└── (CSS framework)

lucide-react@0.263.0
└── (SVG icons)
```

## File Sizes (Approximate)

```
Frontend Source:
├── Pages (3 dashboards) - ~7KB
├── Components (3 reusable) - ~3KB
├── Context & Services - ~2KB
├── Config & entry - ~1KB
└── Total - ~13KB

After Build (minified):
├── JavaScript - ~50-80KB (gzipped: 15-25KB)
├── CSS - ~30-50KB (gzipped: 5-10KB)
└── Total - ~100-150KB

With node_modules:
└── ~500MB (not included in production build)
```

## Security Considerations

Current State:
- ✅ Client-side routing with ProtectedRoute
- ✅ localStorage for demo purposes
- ❌ No real authentication
- ❌ No HTTPS enforcement
- ❌ No token refresh

Production Improvements Needed:
- [ ] JWT token authentication
- [ ] Secure token storage (httpOnly cookies)
- [ ] CORS configuration
- [ ] HTTPS enforcement
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Input validation
- [ ] XSS prevention

## Performance Metrics

Target Metrics:
- ✅ First Contentful Paint < 2s
- ✅ Time to Interactive < 3s
- ✅ Lighthouse score > 90

Optimizations Applied:
- ✅ Tailwind CSS purging
- ✅ React Router code splitting
- ✅ No external CDNs (except Tailwind)
- ✅ Minimal dependencies (5 total)
- ✅ Component-level state management

## Testing Structure (Future)

```
__tests__/
├── pages/
│   ├── Login.test.js
│   ├── ManagerDashboard.test.js
│   ├── TeamLeaderDashboard.test.js
│   └── ClientDashboard.test.js
├── components/
│   ├── Header.test.js
│   ├── CSVUploadModal.test.js
│   └── ProtectedRoute.test.js
├── context/
│   └── AuthContext.test.js
└── services/
    └── api.test.js
```

## Deployment Checklist

Before Production:
- [ ] Update API_URL in .env
- [ ] Configure CORS on backend
- [ ] Implement JWT authentication
- [ ] Set up HTTPS
- [ ] Configure environment variables
- [ ] Build for production (npm build)
- [ ] Test all dashboards
- [ ] Run security audit
- [ ] Set up monitoring
- [ ] Configure CDN (if needed)

---

All files are organized and ready for development with clear separation of concerns and scalable architecture.
