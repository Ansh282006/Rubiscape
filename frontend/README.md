# Rubiscape Dashboard Frontend

A multi-role React dashboard application with three distinct user interfaces: Manager, Team Leader, and Client.

## Features

### 🎯 Three Dashboard Roles

#### Manager Dashboard
- View all projects with analytics overview
- Edit project details (name, team, budget, leader)
- Upload and manage CSV files for projects
- View project progress and team information
- Grid/List view toggle for projects
- Budget tracking and analytics

#### Team Leader Dashboard
- View assigned projects with detailed progress
- Edit and save project details
- Upload CSV files for specific projects
- Monitor completed vs total tasks
- Access to project descriptions and status updates

#### Client Dashboard
- View-only access to project progress
- Download CSV reports uploaded by managers/leaders
- Track project completion status
- Expandable project details
- Read-only interface with download capabilities

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in the root of frontend folder:**
   ```bash
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js              # Navigation header
│   │   ├── ProtectedRoute.js      # Route protection
│   │   └── CSVUploadModal.js      # File upload modal
│   ├── context/
│   │   └── AuthContext.js         # Auth state management
│   ├── pages/
│   │   ├── Login.js               # Login page
│   │   ├── ManagerDashboard.js    # Manager view
│   │   ├── TeamLeaderDashboard.js # Team leader view
│   │   └── ClientDashboard.js     # Client view
│   ├── services/
│   │   └── api.js                 # API integration
│   ├── App.js                     # Main app with routing
│   └── index.js                   # Entry point
├── package.json
├── .env                           # Environment variables
└── README.md
```

## Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner.

## Demo Login

The application supports demo mode. Use any username with the following roles:
- **manager** - Full project management capabilities
- **team_leader** - Project oversight and file upload
- **client** - View-only access with download options

## Backend Integration

The frontend integrates with the FastAPI backend. Ensure the backend is running on `http://localhost:8000`.

### Key API Endpoints

```
GET  /api/v1/projects              - Get all projects
GET  /api/v1/projects/{id}         - Get project details
PUT  /api/v1/projects/{id}         - Update project
POST /api/v1/csv/upload            - Upload CSV file
GET  /api/v1/csv/download/{id}     - Download CSV file
GET  /api/v1/csv/files/{projectId} - List project files
GET  /api/v1/audit/{projectId}     - Get audit logs
```

## Authentication

Currently using localStorage-based authentication for demo purposes. In production, implement:
- JWT tokens from backend
- Secure token storage
- Token refresh logic
- CORS configuration

## Docker Support

To run with Docker:

```bash
# From root directory
docker-compose up
```

The frontend will be available after the backend starts at `http://localhost:3000`.

## Styling

The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8000` |

## Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Advanced analytics and charts
- [ ] User profile management
- [ ] Email notifications
- [ ] Audit trail visualization
- [ ] Role-based permissions UI
- [ ] Search and filtering
- [ ] Bulk CSV upload
- [ ] Report generation
- [ ] Dark mode support

## Troubleshooting

### CORS Errors
Ensure the backend is running and CORS is properly configured.

### API Not Found Errors
Check that `REACT_APP_API_URL` in `.env` matches your backend URL.

### Port Already in Use
Change the port:
```bash
PORT=3001 npm start
```

## Support

For issues or questions about the frontend, please check the main project README or backend documentation.
