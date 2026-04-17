# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`.

## Demo Credentials

No password required. Use any username with one of these roles:

| Role | Username | Access |
|------|----------|--------|
| **Manager** | `manager` | Full project management, analytics, CSV upload/edit |
| **Team Leader** | `leader` | Project oversight, CSV upload, edit project details |
| **Client** | `client` | View-only, download reports |

## Features by Role

### 👨‍💼 Manager Dashboard
- **Analytics**: Total projects, average progress, budget tracking
- **Project Management**: View all projects with detailed information
- **Edit Capabilities**: Update project name, status, team, budget, and description
- **CSV Upload**: Upload data files for projects
- **View Options**: Switch between grid and list views
- **File Management**: Track all uploaded CSV files

### 👨‍💔 Team Leader Dashboard
- **Progress Tracking**: Monitor project progress in percentage
- **Task Overview**: See completed vs. total tasks
- **Edit Details**: Edit project information (name, status, description)
- **CSV Upload**: Upload project-specific CSV files for clients to review
- **File Management**: Maintain and organize project files
- **Project Summary**: Quick view of project status and completion

### 👤 Client Dashboard
- **Read-Only Access**: View projects without edit permissions
- **Progress Visibility**: See project progress percentage
- **CSV Downloads**: Download files uploaded by managers/leaders
- **Expandable Details**: Click to view project details and reports
- **Summary Info**: View overall project status and completion

## API Integration

The frontend expects the backend to be running on `http://localhost:8000`.

### Configure Backend URL
Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
```

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/     # Reusable components
│   ├── context/        # React Context (Auth)
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── App.js          # Main app with routing
│   └── index.js        # Entry point
├── package.json        # Dependencies
├── .env                # Environment config
└── README.md           # Full documentation
```

## Development

### Install Additional Packages
```bash
npm install package-name
```

### Build for Production
```bash
npm build
```

Output will be in the `build/` folder.

## Troubleshooting

### Port 3000 Already in Use
```bash
PORT=3001 npm start
```

### Cannot Connect to Backend
1. Ensure backend is running: `python -m uvicorn app.main:app --reload`
2. Check `.env` has correct `REACT_APP_API_URL`
3. Check backend CORS configuration

### NPM Install Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After setup, you can:
1. Login with different roles to test various dashboards
2. Upload sample CSV files
3. Edit project details
4. Download reports
5. Integrate with your backend API

For more details, see [README.md](./README.md).
