import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database, Save } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Backup', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">General Settings</h2>
                  <p className="text-sm text-slate-500">Configure your inventory system preferences</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      defaultValue="My Inventory Co."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time (EST)</option>
                      <option value="PST">Pacific Time (PST)</option>
                      <option value="IST">India Standard Time (IST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Default Low Stock Threshold</label>
                    <input
                      type="number"
                      defaultValue={10}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Profile Settings</h2>
                  <p className="text-sm text-slate-500">Update your personal information</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    JD
                  </div>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                    Change Avatar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue="john.doe@company.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
                  <p className="text-sm text-slate-500">Choose how you want to receive alerts</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Low Stock Alerts', description: 'Get notified when products fall below minimum stock' },
                    { label: 'Order Updates', description: 'Receive updates on order status changes' },
                    { label: 'Daily Summary', description: 'Get a daily summary of inventory activities' },
                    { label: 'New Supplier Updates', description: 'Notifications when new suppliers are added' },
                    { label: 'Price Changes', description: 'Alerts when product prices are updated' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Security Settings</h2>
                  <p className="text-sm text-slate-500">Manage your account security</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
                  <p className="text-sm text-slate-500">Customize how the application looks</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Light', bg: 'bg-white', text: 'text-slate-900' },
                      { id: 'dark', label: 'Dark', bg: 'bg-slate-900', text: 'text-white' },
                      { id: 'system', label: 'System', bg: 'bg-gradient-to-r from-white to-slate-900', text: 'text-slate-600' },
                    ].map(theme => (
                      <button
                        key={theme.id}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-colors",
                          theme.id === 'light' ? "border-indigo-600" : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <div className={cn("w-full h-16 rounded-lg mb-2", theme.bg, theme.id === 'system' && "border border-slate-200")} />
                        <p className="text-sm font-medium text-slate-700">{theme.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Accent Color</label>
                  <div className="flex gap-3">
                    {['bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-emerald-600', 'bg-amber-600', 'bg-cyan-600'].map((color, i) => (
                      <button
                        key={i}
                        className={cn(
                          "w-10 h-10 rounded-full",
                          color,
                          i === 0 && "ring-2 ring-offset-2 ring-indigo-600"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Data & Backup Settings */}
            {activeTab === 'data' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Data & Backup</h2>
                  <p className="text-sm text-slate-500">Manage your data and create backups</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Export All Data</p>
                        <p className="text-sm text-slate-500">Download all your inventory data as CSV</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Export
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Import Data</p>
                        <p className="text-sm text-slate-500">Import inventory data from CSV file</p>
                      </div>
                      <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-white">
                        Import
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-900">Delete All Data</p>
                        <p className="text-sm text-red-600">Permanently delete all inventory data. This cannot be undone.</p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={handleSave}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-2 rounded-lg transition-colors",
                  saved ? "bg-green-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
                )}
              >
                <Save className="w-4 h-4" />
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
