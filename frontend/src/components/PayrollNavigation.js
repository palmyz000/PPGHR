import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, History, FileText, CheckCircle, Settings } from 'lucide-react';

const PayrollNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/payroll', label: 'ภาพรวม', icon: ChevronRight },
    { path: '/payroll/history', label: 'ประวัติการจ่าย', icon: History },
    { path: '/payroll/structure', label: 'โครงสร้างเงินเดือน', icon: FileText },
    { path: '/payroll/approval', label: 'การอนุมัติ', icon: CheckCircle },
    { path: '/payroll/document', label: 'เอกสาร', icon: FileText },
    { path: '/payroll/settings', label: 'ตั้งค่า', icon: Settings }
  ];

  return (
    <div className="bg-white shadow mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
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

export default PayrollNavigation;