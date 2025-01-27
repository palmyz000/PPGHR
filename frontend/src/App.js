import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/HR/Dashboard';
import EmployeePage from './pages/HR/EmployeePage';
import LeavePage from './pages/HR/LeavePage';
import PayrollPage from './pages/HR/PayrollPage';
import EvaluationPage from './pages/HR/EvaluationPage';
import ReportsPage from './pages/HR/ReportsPage';
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
import Login from './pages/login';
import CreateAccount from './pages/createAccount';
import AdminDashboard from './pages/AdminDashboard';

// Layout component to control Navbar visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  // กำหนดหน้าที่ต้องการให้แสดง Navbar
  const showNavbarRoutes = [
    '/dashboard',
    '/employees',
    '/leave',
    '/payroll',
    '/evaluation',
    '/reports',
    '/payroll/history',
    '/payroll/structure',
    '/payroll/approval',
    '/payroll/document',
    '/payroll/settings'
  ];

  // ตรวจสอบว่าควรแสดง Navbar หรือไม่
  const shouldShowNavbar = () => {
    const path = location.pathname;
    // ตรวจสอบว่า path ปัจจุบันอยู่ในรายการที่ต้องแสดง Navbar หรือไม่
    return showNavbarRoutes.includes(path);
  };

  // อัพเดท activeTab เมื่อ route เปลี่ยน
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) setActiveTab('dashboard');
    else if (path.startsWith('/employees')) setActiveTab('employees');
    else if (path.startsWith('/leave')) setActiveTab('leave');
    else if (path.startsWith('/payroll')) setActiveTab('payroll');
    else if (path.startsWith('/evaluation')) setActiveTab('evaluation');
    else if (path.startsWith('/reports')) setActiveTab('reports');
  }, [location.pathname]);

  return (
    <>
      {shouldShowNavbar() && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />}
      {children}
    </>
  );
};

const App = () => {
  // Redirect to /login if the path is "/"
  useEffect(() => {
    if (window.location.pathname === '/') {
      window.location.replace('/login');
    }
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Admin Routes - ไม่แสดง Navbar */}
          <Route path="/admindashboard" element={<AdminDashboard />} />
          
          {/* HR Routes - แสดง Navbar */}
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

          {/* Authentication Routes - ไม่แสดง Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/createaccount" element={<CreateAccount />} />

          {/* Employee Routes - ไม่แสดง Navbar */}
          <Route path="/employee-portal" element={<EmployeePortal />} />
          <Route path="/employee/documents" element={<EmployeeDocuments />} />
          <Route path="/employee/payroll" element={<EmployeePayroll />} />
          <Route path="/employee/timesheet" element={<EmployeeTimesheet />} />
          <Route path="/employee/leave" element={<EmployeeLeave />} />
          <Route path="/employee/layout" element={<EmployeeLayout />} />

          {/* Catch-All Route: Redirect to Login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
