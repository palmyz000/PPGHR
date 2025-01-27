import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, History, FileText, CheckCircle, Settings } from 'lucide-react';
import logo from "../assets/images/logo-peerapat-og.png";

const EmployeeNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/employee/layout', label: 'หน้าหลัก', icon: ChevronRight },
    { path: '/employee/documents', label: 'เอกสารของพนักงาน', icon: History },
    { path: '/employee-portal', label: 'เค้าโครงพนักงาน', icon: FileText },
    { path: '/employee/payroll', label: 'หน้าพนักงาน', icon: CheckCircle },
    { path: '/employee/timesheet', label: 'การบันทึกเวลา', icon: Settings }
  ];

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="flex items-center space-x-8">
            <img src={logo} alt="PPGHR Logo" className="navbar-logo w-17 h-16 object-contain" />
            <h1 className="text-xl font-bold text-blue-900">PPGHR Software and Systems</h1>
          </div>
        </div>

        <div className="flex space-x-8 px-6 py-4">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-4 text-sm font-medium ${
                  isActive
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeeNavigation;
