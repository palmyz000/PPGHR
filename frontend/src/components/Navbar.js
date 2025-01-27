import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/images/logo-peerapat-og.png";

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white shadow-md">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="flex items-center space-x-8">
            <img src={logo} alt="PPGHR Logo" className="navbar-logo w-17 h-16 object-contain" />
            <h1 className="text-xl font-bold text-blue-900">PPGHR Software and Systems</h1>
            <nav className="flex space-x-4">
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </Link>
              <Link
                to="/employees"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'employees' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('employees')}
              >
                พนักงาน
              </Link>
              <Link
                to="/leave"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'leave' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('leave')}
              >
                การลา
              </Link>
              <Link
                to="/payroll"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'payroll' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('payroll')}
              >
                เงินเดือน
              </Link>
              <Link
                to="/evaluation"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'evaluation' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('evaluation')}
              >
                การประเมิน
              </Link>
              <Link
                to="/reports"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'reports' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('reports')}
              >
                รายงาน
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">สวัสดี,</p>
              <p className="font-medium">คุณสมชาย</p>
            </div>
            <img 
              src="/api/placeholder/32/32"
              alt="Profile"
              className="w-8 h-8 rounded-full bg-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;