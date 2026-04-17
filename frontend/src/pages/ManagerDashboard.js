import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Upload, Download, Edit2, Save, X, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import CSVUploadModal from '../components/CSVUploadModal';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Pipeline A',
      progress: 75,
      status: 'In Progress',
      description: 'Data processing pipeline',
      completed_tasks: 15,
      total_tasks: 20,
      budget: '$50,000',
      team: 'Team 1',
      leader: 'John Doe',
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
      budget: '$75,000',
      team: 'Team 2',
      leader: 'Jane Smith',
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
      budget: '$45,000',
      team: 'Team 1',
      leader: 'John Doe',
      files: [
        { id: 2, name: 'final_results.csv', uploadedAt: '2024-04-05', size: '5.1MB' },
      ],
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const handleEdit = (project) => {
    setEditingId(project.id);
    setEditData({ ...project });
  };

  const handleSave = (projectId) => {
    setProjects(projects.map(p => p.id === projectId ? editData : p));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleUpload = (projectId) => {
    setSelectedProject(projects.find(p => p.id === projectId));
    setUploadModal(true);
  };

  const handleFileUpload = (projectId, file) => {
    const newFile = {
      id: Date.now(),
      name: file.name,
      uploadedAt: new Date().toLocaleDateString(),
      size: (file.size / 1024 / 1024).toFixed(1) + 'MB',
    };
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, files: [...p.files, newFile] } : p
    ));
    setUploadModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalBudget = projects.reduce((sum, p) => {
    return sum + parseInt(p.budget.replace(/[^0-9]/g, ''));
  }, 0);

  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} role="Manager" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{projects.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Average Progress</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{avgProgress}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Total Budget</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">${(totalBudget / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {projects.filter(p => p.status === 'Completed').length}/{projects.length}
            </p>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                List
              </button>
            </div>
          </div>

          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                    {editingId === project.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                            <input
                              type="text"
                              value={editData.team}
                              onChange={(e) => setEditData({ ...editData, team: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                            <input
                              type="text"
                              value={editData.budget}
                              onChange={(e) => setEditData({ ...editData, budget: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(project.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            <Save className="w-4 h-4 inline mr-1" /> Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                          >
                            <X className="w-4 h-4 inline mr-1" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4 text-sm">
                          <p className="text-gray-600"><strong>Team:</strong> {project.team}</p>
                          <p className="text-gray-600"><strong>Leader:</strong> {project.leader}</p>
                          <p className="text-gray-600"><strong>Budget:</strong> {project.budget}</p>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-600">Progress</span>
                            <span className="text-xs font-bold">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleEdit(project)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Edit2 className="w-4 h-4 inline mr-1" /> Edit Details
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                          <div><span className="text-gray-600">Team: </span>{project.team}</div>
                          <div><span className="text-gray-600">Leader: </span>{project.leader}</div>
                          <div><span className="text-gray-600">Budget: </span>{project.budget}</div>
                          <div><span className="text-gray-600">Progress: </span>{project.progress}%</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpload(project.id)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {uploadModal && (
        <CSVUploadModal
          project={selectedProject}
          onClose={() => setUploadModal(false)}
          onUpload={handleFileUpload}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
