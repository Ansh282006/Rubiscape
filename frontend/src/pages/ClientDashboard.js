import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Download, Eye } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects] = useState([
    {
      id: 1,
      name: 'Pipeline A',
      progress: 75,
      status: 'In Progress',
      description: 'Data processing pipeline',
      completed_tasks: 15,
      total_tasks: 20,
      files: [
        { id: 1, name: 'data_export_01.csv', uploadedAt: '2024-04-10', size: '2.5MB' },
      ],
    },
    {
      id: 2,
      name: 'Pipeline B',
      progress: 45,
      status: 'In Progress',
      description: 'Model training pipeline',
      completed_tasks: 9,
      total_tasks: 20,
      files: [],
    },
    {
      id: 3,
      name: 'Pipeline C',
      progress: 100,
      status: 'Completed',
      description: 'Deployment pipeline',
      completed_tasks: 20,
      total_tasks: 20,
      files: [
        { id: 2, name: 'final_results.csv', uploadedAt: '2024-04-05', size: '5.1MB' },
      ],
    },
  ]);

  const [expandedId, setExpandedId] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDownload = (fileName) => {
    // Simulate file download
    alert(`Downloading ${fileName}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} role="Client" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-blue-100">
            Review your project progress and download the latest reports
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-gray-600 text-sm font-medium">Total Projects</h3>
            <p className="text-4xl font-bold text-blue-600 mt-3">{projects.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-gray-600 text-sm font-medium">Average Progress</h3>
            <p className="text-4xl font-bold text-blue-600 mt-3">
              {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
            <p className="text-4xl font-bold text-green-600 mt-3">
              {projects.filter(p => p.status === 'Completed').length}/{projects.length}
            </p>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Projects</h2>
          
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              {/* Project Header */}
              <div
                className="p-6 cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{project.description}</p>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Task Summary */}
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      {project.completed_tasks} of {project.total_tasks} tasks completed
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0">
                  <Eye className={`w-6 h-6 text-gray-400 transition-transform ${
                    expandedId === project.id ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === project.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-4">Available Reports</h4>
                  
                  {project.files.length > 0 ? (
                    <div className="space-y-3">
                      {project.files.map(file => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300"
                        >
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{file.name}</h5>
                            <p className="text-sm text-gray-500 mt-1">
                              Uploaded on {file.uploadedAt} • {file.size}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDownload(file.name)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ml-4"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reports available yet</p>
                      <p className="text-sm text-gray-400 mt-1">Check back soon for updates</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click on a project to view detailed progress and available reports</li>
            <li>• Download CSV files and reports for your review</li>
            <li>• Project managers and team leaders will upload updates regularly</li>
            <li>• Check back frequently for the latest project information</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
