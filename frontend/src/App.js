import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // ใช้ Routes แทน Switch
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import EmployeePage from './EmployeePage';
import LeavePage from './LeavePage';
import PayrollPage from './PayrollPage';
import EvaluationPage from './EvaluationPage';
import ReportsPage from './ReportsPage'; // เพิ่มหน้ารายงาน

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // ใช้ useState เพื่อจัดการแท็บที่เลือก

  return (
    <Router>
      <div>
        {/* ส่ง setActiveTab ไปที่ Navbar เพื่อให้ปรับเปลี่ยน activeTab */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="max-w-screen-2xl mx-auto p-6">
          {/* ใช้ Routes และ Route */}
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/leave" element={<LeavePage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
