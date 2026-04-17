import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Upload, Download, Edit2, Save, X } from 'lucide-react';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import CSVUploadModal from '../components/CSVUploadModal';
import { useNavigate } from 'react-router-dom';

const TeamLeaderDashboard = () => {
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

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} role="Team Leader" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{projects.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">In Progress</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {projects.filter(p => p.status === 'In Progress').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {projects.filter(p => p.status === 'Completed').length}
            </p>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {projects.map(project => (
              <div key={project.id} className="p-6">
                {editingId === project.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Name
                        </label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option>In Progress</option>
                          <option>Completed</option>
                          <option>On Hold</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(project.id)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        <Save className="w-4 h-4" /> Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                          <p className="text-gray-600 mt-1">{project.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Progress</span>
                          <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Task Summary */}
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">
                          {project.completed_tasks}/{project.total_tasks} tasks completed
                        </span>
                      </div>

                      {/* CSV Files */}
                      {project.files.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Files:</h4>
                          <div className="space-y-2">
                            {project.files.map(file => (
                              <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-500">{file.uploadedAt} • {file.size}</p>
                                </div>
                                <Download className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-800" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-fit">
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleUpload(project.id)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        <Upload className="w-4 h-4" /> Upload CSV
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
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

export default TeamLeaderDashboard;
