import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminComponents.css';

const ExportData = () => {
  const [exportConfig, setExportConfig] = useState({
    dataType: 'users',
    format: 'csv',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    includeFields: {
      users: ['id', 'name', 'email', 'role', 'department', 'created_at'],
      employees: ['id', 'name', 'email', 'department', 'position', 'hire_date'],
      departments: ['id', 'name', 'description', 'employee_count'],
      reports: ['id', 'title', 'type', 'created_by', 'created_at']
    }
  });
  
  const [selectedFields, setSelectedFields] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setSelectedFields(exportConfig.includeFields[exportConfig.dataType]);
    fetchExportHistory();
  }, [exportConfig.dataType]);

  const fetchExportHistory = async () => {
    try {
      // Simulate export history - replace with actual API
      const history = [
        {
          id: 1,
          type: 'Users Export',
          format: 'CSV',
          date: '2024-01-15',
          status: 'Completed',
          records: 1234,
          size: '2.5 MB'
        },
        {
          id: 2,
          type: 'Employee Report',
          format: 'Excel',
          date: '2024-01-14',
          status: 'Completed',
          records: 856,
          size: '1.8 MB'
        },
        {
          id: 3,
          type: 'Department Analytics',
          format: 'PDF',
          date: '2024-01-13',
          status: 'Failed',
          records: 0,
          size: '0 MB'
        }
      ];
      setExportHistory(history);
    } catch (error) {
      console.error('Error fetching export history:', error);
    }
  };

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handlePreview = async () => {
    try {
      setShowPreview(true);
      // Simulate preview data - replace with actual API
      const sampleData = generateSampleData(exportConfig.dataType);
      setPreviewData(sampleData.slice(0, 5)); // Show first 5 records
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const generateSampleData = (dataType) => {
    switch (dataType) {
      case 'users':
        return [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', department: 'IT', created_at: '2024-01-01' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', department: 'HR', created_at: '2024-01-02' }
        ];
      case 'employees':
        return [
          { id: 1, name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering', position: 'Developer', hire_date: '2023-06-15' },
          { id: 2, name: 'Bob Wilson', email: 'bob@example.com', department: 'Marketing', position: 'Manager', hire_date: '2023-08-20' }
        ];
      default:
        return [];
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const exportData = {
        dataType: exportConfig.dataType,
        format: exportConfig.format,
        fields: selectedFields,
        dateRange: exportConfig.dateRange,
        startDate: exportConfig.startDate,
        endDate: exportConfig.endDate
      };

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would call your export API
      // const response = await axios.post('http://localhost:5000/api/export', exportData);
      
      // Simulate file download
      const filename = `${exportConfig.dataType}_export_${new Date().toISOString().split('T')[0]}.${exportConfig.format}`;
      
      // Create a mock download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Sample export data'));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // Refresh export history
      fetchExportHistory();
      
      alert('Export completed successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="admin-main-content">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="page-title">
            <h1>Export Data</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Admin</a></li>
                <li className="breadcrumb-item">Reports</li>
                <li className="breadcrumb-item active">Export Data</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="row g-4">
            
            {/* Export Configuration */}
            <div className="col-lg-8">
              <div className="professional-table">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-download me-2"></i>
                    Export Configuration
                  </h5>
                  
                  <div className="row g-3">
                    {/* Data Type Selection */}
                    <div className="col-md-6">
                      <label className="form-label">Data Type</label>
                      <select 
                        className="form-select"
                        value={exportConfig.dataType}
                        onChange={(e) => setExportConfig(prev => ({...prev, dataType: e.target.value}))}
                      >
                        <option value="users">Users</option>
                        <option value="employees">Employees</option>
                        <option value="departments">Departments</option>
                        <option value="reports">Reports</option>
                      </select>
                    </div>

                    {/* Format Selection */}
                    <div className="col-md-6">
                      <label className="form-label">Export Format</label>
                      <select 
                        className="form-select"
                        value={exportConfig.format}
                        onChange={(e) => setExportConfig(prev => ({...prev, format: e.target.value}))}
                      >
                        <option value="csv">CSV</option>
                        <option value="xlsx">Excel (XLSX)</option>
                        <option value="json">JSON</option>
                        <option value="pdf">PDF Report</option>
                      </select>
                    </div>

                    {/* Date Range */}
                    <div className="col-md-6">
                      <label className="form-label">Date Range</label>
                      <select 
                        className="form-select"
                        value={exportConfig.dateRange}
                        onChange={(e) => setExportConfig(prev => ({...prev, dateRange: e.target.value}))}
                      >
                        <option value="all">All Time</option>
                        <option value="last30days">Last 30 Days</option>
                        <option value="last90days">Last 90 Days</option>
                        <option value="lastyear">Last Year</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>

                    {/* Custom Date Range */}
                    {exportConfig.dateRange === 'custom' && (
                      <>
                        <div className="col-md-3">
                          <label className="form-label">Start Date</label>
                          <input 
                            type="date" 
                            className="form-control"
                            value={exportConfig.startDate}
                            onChange={(e) => setExportConfig(prev => ({...prev, startDate: e.target.value}))}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">End Date</label>
                          <input 
                            type="date" 
                            className="form-control"
                            value={exportConfig.endDate}
                            onChange={(e) => setExportConfig(prev => ({...prev, endDate: e.target.value}))}
                          />
                        </div>
                      </>
                    )}

                    {/* Field Selection */}
                    <div className="col-12">
                      <label className="form-label">Include Fields</label>
                      <div className="row g-2">
                        {exportConfig.includeFields[exportConfig.dataType].map(field => (
                          <div key={field} className="col-md-3">
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id={`field-${field}`}
                                checked={selectedFields.includes(field)}
                                onChange={() => handleFieldToggle(field)}
                              />
                              <label className="form-check-label" htmlFor={`field-${field}`}>
                                {field.replace('_', ' ').toUpperCase()}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={handlePreview}
                          disabled={selectedFields.length === 0}
                        >
                          <i className="bi bi-eye me-2"></i>
                          Preview Data
                        </button>
                        <button 
                          className="btn btn-primary"
                          onClick={handleExport}
                          disabled={isExporting || selectedFields.length === 0}
                        >
                          {isExporting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Exporting...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-download me-2"></i>
                              Export Data
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              {showPreview && previewData.length > 0 && (
                <div className="professional-table mt-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="bi bi-eye me-2"></i>
                      Data Preview (First 5 records)
                    </h5>
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            {selectedFields.map(field => (
                              <th key={field}>{field.replace('_', ' ').toUpperCase()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr key={index}>
                              {selectedFields.map(field => (
                                <td key={field}>{row[field] || 'N/A'}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Export History */}
            <div className="col-lg-4">
              <div className="professional-table">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-clock-history me-2"></i>
                    Export History
                  </h5>
                  
                  <div className="export-history">
                    {exportHistory.map(item => (
                      <div key={item.id} className="export-item border-bottom py-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{item.type}</h6>
                            <small className="text-muted">
                              {item.format} • {item.records} records • {item.size}
                            </small>
                            <br />
                            <small className="text-muted">{item.date}</small>
                          </div>
                          <span className={`badge ${item.status === 'Completed' ? 'bg-success' : 'bg-danger'}`}>
                            {item.status}
                          </span>
                        </div>
                        {item.status === 'Completed' && (
                          <button className="btn btn-sm btn-outline-primary mt-2">
                            <i className="bi bi-download me-1"></i>
                            Download
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Export Tips */}
              <div className="info-card mt-4">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="bi bi-lightbulb me-2"></i>
                    Export Tips
                  </h6>
                  <ul className="list-unstyled small">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      CSV format is best for spreadsheet applications
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Excel format preserves formatting and formulas
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      JSON format is ideal for API integrations
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      PDF format creates professional reports
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default ExportData;
