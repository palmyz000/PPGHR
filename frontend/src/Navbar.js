import React from 'react';
import { AlertCircle } from 'lucide-react';
import EmployeePage from './EmployeePage';
import LeavePage from './LeavePage';
import EvaluationPage from './EvaluationPage';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { name: 'Dashboard', key: 'dashboard' },
    { name: 'พนักงาน', key: 'employees' },
    { name: 'การลา', key: 'leave' },
    { name: 'เงินเดือน', key: 'payroll' },
    { name: 'การประเมิน', key: 'evaluation' },
    { name: 'รายงาน', key: 'reports' }
  ];

  const handleTabClick = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-blue-900">HR Management System</h1>
            <nav className="flex space-x-4">
              {navItems.map(tab => (
                <button
                  key={tab.key}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.key ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                  }`}
                  onClick={() => handleTabClick(tab.key)}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
              <AlertCircle className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-200 rounded-full" />
              <span className="text-sm text-gray-700">HR Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
