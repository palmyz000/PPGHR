import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EmployeePage from './pages/employee/EmployeePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/payroll/PayrollPage';
import EvaluationPage from './pages/EvaluationPage';
import ReportsPage from './pages/ReportsPage';
import PayrollHistory from './pages/payroll/PayrollHistory';
import PayrollStructure from './pages/payroll/PayrollStructure';
import PayrollApproval from './pages/payroll/PayrollApproval';
import PayrollDocument from './pages/payroll/PayrollDocument';
import PayrollSettings from './pages/payroll/PayrollSettings';
import EmployeePortal from './pages/employee/EmployeePortal';
import EmployeeDocuments from './pages/employee/EmployeeDocuments';
import EmployeePayroll from './pages/employee/EmployeePayroll';
import EmployeeTimesheet from './pages/employee/EmployeeTimesheet';
import EmployeeLeave from './pages/employee/EmployeeLeave';
import EmployeeLayout from './pages/employee/EmployeeLayout';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <Routes>
        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeePage />} />
        <Route path="/leave" element={<LeavePage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/evaluation" element={<EvaluationPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/payroll/history" element={<PayrollHistory />} />
        <Route path="/payroll/structure" element={<PayrollStructure />} />
        <Route path="/payroll/approval" element={<PayrollApproval />} />
        <Route path="/payroll/document" element={<PayrollDocument />} />
        <Route path="/payroll/settings" element={<PayrollSettings />} />

        {/* Employee Routes */}
        <Route path="/employee-portal" element={<EmployeePortal />} />
        <Route path="/employee/documents" element={<EmployeeDocuments />} />
        <Route path="/employee/payroll" element={<EmployeePayroll />} />
        <Route path="/employee/timesheet" element={<EmployeeTimesheet />} />
        <Route path="/employee/leave" element={<EmployeeLeave />} />
        <Route path="/employee/layout" element={<EmployeeLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
