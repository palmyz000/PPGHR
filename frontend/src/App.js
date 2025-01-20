import React, { useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import EmployeePage from './EmployeePage';
import LeavePage from './LeavePage';
import PayrollPage from './PayrollPage'; // ตัวอย่างหน้าเงินเดือน
import EvaluationPage from './EvaluationPage'; // ตัวอย่างหน้าการประเมินผล
import ReportsPage from './ReportsPage'; // ตัวอย่างหน้ารายงาน
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // กำหนดค่าเริ่มต้นเป็น 'dashboard'

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeePage />;
      case 'leave':
        return <LeavePage />;
      case 'payroll':
        return <PayrollPage />;
      case 'evaluation':
        return <EvaluationPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="max-w-screen-2xl mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
