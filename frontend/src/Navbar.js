import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white shadow-md">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-blue-900">HR Management System</h1>
            <nav className="flex space-x-4">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('dashboard')}  // เปลี่ยน activeTab เมื่อคลิก
              >
                Dashboard
              </Link>
              <Link
                to="/employees"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'employees' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('employees')}  // เปลี่ยน activeTab เมื่อคลิก
              >
                พนักงาน
              </Link>
              <Link
                to="/leave"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'leave' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('leave')}  // เปลี่ยน activeTab เมื่อคลิก
              >
                การลา
              </Link>
              <Link
                to="/payroll"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'payroll' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('payroll')}  // เปลี่ยน activeTab เมื่อคลิก
              >
                เงินเดือน
              </Link>
              <Link
                to="/evaluation"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'evaluation' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('evaluation')}  // เปลี่ยน activeTab เมื่อคลิก
              >
                การประเมิน
              </Link>
              <Link
                to="/reports"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'reports' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('reports')}  // เปลี่ยน activeTab เมื่อคลิก
              >
                รายงาน
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
