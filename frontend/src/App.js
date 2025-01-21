import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // ใช้ Routes แทน Switch
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EmployeePage from './pages/EmployeePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/payroll/PayrollPage';
import EvaluationPage from './pages/EvaluationPage';
import ReportsPage from './pages/ReportsPage'; // เพิ่มหน้ารายงาน
import PayrollHistory from './pages/payroll/PayrollHistory';
import PayrollStructure from './pages/payroll/PayrollStructure';
import PayrollApproval from './pages/payroll/PayrollApproval';
import PayrollDocument from './pages/payroll/PayrollDocument';
import PayrollSettings from './pages/payroll/PayrollSettings';

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
            <Route path="/payroll/history" element={<PayrollHistory />} />
            <Route path="/payroll/structure" element={<PayrollStructure />} />
            <Route path="/payroll/approval" element={<PayrollApproval />} />
            <Route path="/payroll/document" element={<PayrollDocument />} />
            <Route path="/payroll/settings" element={<PayrollSettings
            />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
