import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminComponents.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'IT ERP System',
      siteDescription: 'Enterprise Resource Planning System',
      adminEmail: 'admin@company.com',
      timezone: 'UTC',
      language: 'en',
      dateFormat: 'YYYY-MM-DD',
      maintenanceMode: false
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      ipWhitelist: ''
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      newUserRegistration: true,
      systemAlerts: true,
      weeklyReports: true,
      maintenanceAlerts: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      backupLocation: 'local',
      lastBackup: '2024-01-15 10:30:00'
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [systemInfo, setSystemInfo] = useState({
    version: '2.0.1',
    database: 'MySQL 8.0',
    server: 'Apache 2.4',
    php: 'PHP 8.1',
    storage: '45.2 GB / 100 GB',
    uptime: '15 days, 4 hours'
  });

  useEffect(() => {
    fetchSettings();
    fetchSystemInfo();
  }, []);

  const fetchSettings = async () => {
    try {
      // Simulate API call - replace with actual endpoint
      // const response = await axios.get('http://localhost:5000/api/settings');
      // setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchSystemInfo = async () => {
    try {
      // Simulate API call - replace with actual endpoint
      // const response = await axios.get('http://localhost:5000/api/system-info');
      // setSystemInfo(response.data);
    } catch (error) {
      console.error('Error fetching system info:', error);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');
      
      // Simulate API call - replace with actual endpoint
      // await axios.put('http://localhost:5000/api/settings', settings);
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackupNow = async () => {
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Backup completed successfully!');
      
      // Update last backup time
      setSettings(prev => ({
        ...prev,
        backup: {
          ...prev.backup,
          lastBackup: new Date().toLocaleString()
        }
      }));
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Backup failed. Please try again.');
    }
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h5>General Settings</h5>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Site Name</label>
          <input 
            type="text" 
            className="form-control"
            value={settings.general.siteName}
            onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Admin Email</label>
          <input 
            type="email" 
            className="form-control"
            value={settings.general.adminEmail}
            onChange={(e) => handleSettingChange('general', 'adminEmail', e.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Site Description</label>
          <textarea 
            className="form-control" 
            rows="3"
            value={settings.general.siteDescription}
            onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Timezone</label>
          <select 
            className="form-select"
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Language</label>
          <select 
            className="form-select"
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Date Format</label>
          <select 
            className="form-select"
            value={settings.general.dateFormat}
            onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          </select>
        </div>
        <div className="col-12">
          <div className="form-check">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="maintenanceMode"
              checked={settings.general.maintenanceMode}
              onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="maintenanceMode">
              Enable Maintenance Mode
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h5>Security Settings</h5>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Minimum Password Length</label>
          <input 
            type="number" 
            className="form-control"
            min="6"
            max="20"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Session Timeout (minutes)</label>
          <input 
            type="number" 
            className="form-control"
            min="5"
            max="120"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Max Login Attempts</label>
          <input 
            type="number" 
            className="form-control"
            min="3"
            max="10"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Password Requirements</label>
          <div className="row g-2">
            <div className="col-md-3">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="requireSpecialChars"
                  checked={settings.security.requireSpecialChars}
                  onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="requireSpecialChars">
                  Special Characters
                </label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="requireNumbers"
                  checked={settings.security.requireNumbers}
                  onChange={(e) => handleSettingChange('security', 'requireNumbers', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="requireNumbers">
                  Numbers
                </label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="requireUppercase"
                  checked={settings.security.requireUppercase}
                  onChange={(e) => handleSettingChange('security', 'requireUppercase', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="requireUppercase">
                  Uppercase Letters
                </label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="twoFactorAuth"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="twoFactorAuth">
                  Two-Factor Auth
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <label className="form-label">IP Whitelist (comma-separated)</label>
          <textarea 
            className="form-control" 
            rows="3"
            placeholder="192.168.1.1, 10.0.0.1"
            value={settings.security.ipWhitelist}
            onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h5>Notification Settings</h5>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Notification Channels</label>
          <div className="row g-2">
            <div className="col-md-4">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="emailNotifications"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="emailNotifications">
                  Email Notifications
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="smsNotifications"
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="smsNotifications">
                  SMS Notifications
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="pushNotifications"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="pushNotifications">
                  Push Notifications
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <label className="form-label">Event Notifications</label>
          <div className="row g-2">
            <div className="col-md-6">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="newUserRegistration"
                  checked={settings.notifications.newUserRegistration}
                  onChange={(e) => handleSettingChange('notifications', 'newUserRegistration', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="newUserRegistration">
                  New User Registration
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="systemAlerts"
                  checked={settings.notifications.systemAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="systemAlerts">
                  System Alerts
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="weeklyReports"
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="weeklyReports">
                  Weekly Reports
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="maintenanceAlerts"
                  checked={settings.notifications.maintenanceAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'maintenanceAlerts', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="maintenanceAlerts">
                  Maintenance Alerts
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="admin-main-content">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="page-title">
            <h1>System Settings</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Admin</a></li>
                <li className="breadcrumb-item active">Settings</li>
              </ol>
            </nav>
          </div>
          <div className="dashboard-actions">
            <button 
              className="btn btn-primary"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className={`alert ${saveMessage.includes('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`}>
            {saveMessage}
            <button type="button" className="btn-close" onClick={() => setSaveMessage('')}></button>
          </div>
        )}

        <div className="dashboard-content">
          <div className="row g-4">
            
            {/* Settings Navigation */}
            <div className="col-lg-3">
              <div className="professional-table">
                <div className="card-body">
                  <h6 className="card-title">Settings Categories</h6>
                  <div className="list-group list-group-flush">
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'general' ? 'active' : ''}`}
                      onClick={() => setActiveTab('general')}
                    >
                      <i className="bi bi-gear me-2"></i>
                      General
                    </button>
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'security' ? 'active' : ''}`}
                      onClick={() => setActiveTab('security')}
                    >
                      <i className="bi bi-shield-lock me-2"></i>
                      Security
                    </button>
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'notifications' ? 'active' : ''}`}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <i className="bi bi-bell me-2"></i>
                      Notifications
                    </button>
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'backup' ? 'active' : ''}`}
                      onClick={() => setActiveTab('backup')}
                    >
                      <i className="bi bi-cloud-arrow-up me-2"></i>
                      Backup
                    </button>
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'system' ? 'active' : ''}`}
                      onClick={() => setActiveTab('system')}
                    >
                      <i className="bi bi-info-circle me-2"></i>
                      System Info
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="col-lg-9">
              <div className="professional-table">
                <div className="card-body">
                  {activeTab === 'general' && renderGeneralSettings()}
                  {activeTab === 'security' && renderSecuritySettings()}
                  {activeTab === 'notifications' && renderNotificationSettings()}
                  
                  {activeTab === 'backup' && (
                    <div className="settings-section">
                      <h5>Backup Settings</h5>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="autoBackup"
                              checked={settings.backup.autoBackup}
                              onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="autoBackup">
                              Enable Automatic Backup
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Backup Frequency</label>
                          <select 
                            className="form-select"
                            value={settings.backup.backupFrequency}
                            onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Retention Period (days)</label>
                          <input 
                            type="number" 
                            className="form-control"
                            min="1"
                            max="365"
                            value={settings.backup.backupRetention}
                            onChange={(e) => handleSettingChange('backup', 'backupRetention', parseInt(e.target.value))}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Last Backup</label>
                          <input 
                            type="text" 
                            className="form-control"
                            value={settings.backup.lastBackup}
                            readOnly
                          />
                        </div>
                        <div className="col-12">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={handleBackupNow}
                          >
                            <i className="bi bi-cloud-arrow-up me-2"></i>
                            Backup Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'system' && (
                    <div className="settings-section">
                      <h5>System Information</h5>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="info-item">
                            <strong>System Version:</strong> {systemInfo.version}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="info-item">
                            <strong>Database:</strong> {systemInfo.database}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="info-item">
                            <strong>Web Server:</strong> {systemInfo.server}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="info-item">
                            <strong>PHP Version:</strong> {systemInfo.php}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="info-item">
                            <strong>Storage Usage:</strong> {systemInfo.storage}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="info-item">
                            <strong>System Uptime:</strong> {systemInfo.uptime}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
