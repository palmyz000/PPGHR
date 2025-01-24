// EmployeePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Download, Upload, MoreVertical, Loader
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const EmployeePage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState({});
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);

  const departments = ['IT', 'Marketing', 'Sales', 'Finance', 'HR'];
  const statuses = [
    { value: "1", label: "ทำงาน" },
    { value: "0", label: "หยุดงาน" }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tenant_id = localStorage.getItem('tenant_id');

    if (!token || !tenant_id) {
      navigate('/login');
      return;
    }
    fetchEmployees();
  }, [navigate]);

  // ลบฟังก์ชัน fetchEmployees ตัวแรกออก และใช้ตัวที่สอง
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const tenant_id = localStorage.getItem('tenant_id');
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/api/employees/tenant', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenant_id  // แก้ให้ตรงกับ middleware
        }
      });

      if (!response.ok) throw new Error('Failed to fetch employees');

      const result = await response.json();
      setEmployees(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error('Error:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };
  const [newEmployee, setNewEmployee] = useState({
    emp_code: '',
    name: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    hire_date: '',
    is_active: 1
  });
  const handleAddEmployee = async (newEmployeeData) => {
    try {
      const tenant_id = localStorage.getItem('tenant_id');
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/api/employees/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'tenant-id': tenant_id
        },
        body: JSON.stringify({ ...newEmployeeData, tenant_id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      await fetchEmployees();
      setShowAddModal(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มพนักงาน');
      throw error;
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      const tenant_id = localStorage.getItem('tenant_id');
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/api/employees/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'tenant-id': tenant_id
        },
        body: JSON.stringify({ ...editEmployee, tenant_id })
      });

      if (!response.ok) throw new Error('Error updating employee');

      setShowEditModal(false);
      alert('แก้ไขข้อมูลสำเร็จ');
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    }
  };

  const handleDeleteClick = async (emp_code) => {
    if (window.confirm('คุณต้องการลบพนักงานนี้ใช่หรือไม่?')) {
      try {
        const tenant_id = localStorage.getItem('tenant_id');
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:8000/api/employees/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'tenant-id': tenant_id
          },
          body: JSON.stringify({ emp_code, tenant_id })
        });

        if (!response.ok) throw new Error('Error deleting employee');

        alert('ลบข้อมูลสำเร็จ');
        fetchEmployees();
      } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };

  const handleCsvUpload = () => {
    if (!csvFile) {
      alert("กรุณาเลือกไฟล์ CSV");
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const tenant_id = localStorage.getItem('tenant_id');
        const token = localStorage.getItem('token');
        const employees = results.data.map(emp => ({ ...emp, tenant_id }));

        try {
          for (const employee of employees) {
            const response = await fetch('http://localhost:8000/api/employees/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'tenant-id': tenant_id
              },
              body: JSON.stringify(employee)
            });

            if (!response.ok) {
              const error = await response.json();
              console.error(`Error adding employee: ${employee.emp_code}`, error);
            }
          }
          alert("นำเข้าข้อมูลสำเร็จ");
          setShowCsvModal(false);
          fetchEmployees();
        } catch (error) {
          console.error("Error:", error);
          alert("เกิดข้อผิดพลาดในการนำเข้าไฟล์ CSV");
        }
      }
    });
  };

  const handleDownloadExcel = () => {
    if (filteredEmployees.length === 0) {
      alert("ไม่มีข้อมูลสำหรับดาวน์โหลด");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredEmployees.map(emp => ({
      "รหัสพนักงาน": emp.emp_code,
      "ชื่อ-นามสกุล": emp.name,
      "แผนก": emp.department,
      "ตำแหน่ง": emp.position,
      "อีเมล": emp.email,
      "เบอร์โทรศัพท์": emp.phone,
      "สถานะ": emp.is_active === 1 ? "ทำงาน" : "หยุดงาน",
      "วันที่เริ่มงาน": emp.hire_date,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "พนักงาน");
    XLSX.writeFile(workbook, "รายชื่อพนักงาน.xlsx");
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchStatus = selectedStatus === 'all' || employee.is_active.toString() === selectedStatus;
    const matchSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.emp_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDepartment && matchStatus && matchSearch;
  });

  const toggleDropdown = (empCode) => {
    setShowDropdown(prev => prev === empCode ? null : empCode);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status) => {
    return (status === 1 || status === '1') ?
      'bg-green-100 text-green-800' :
      'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    return (status === 1 || status === '1') ? 'ทำงาน' : 'หยุดงาน';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">สำเร็จ!</strong>
            <span className="block sm:inline"> เพิ่มข้อมูลพนักงานเรียบร้อยแล้ว</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">พนักงาน</h1>
          <p className="text-sm text-gray-600">จัดการข้อมูลพนักงานทั้งหมด</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มพนักงานใหม่
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาพนักงาน..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="w-48">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="all">แผนกทั้งหมด</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="all">สถานะทั้งหมด</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowCsvModal(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="นำเข้าข้อมูล"
            >
              <Upload className="w-5 h-5" />
            </button>

            <button
              onClick={handleDownloadExcel}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="ส่งออกข้อมูล"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  รหัสพนักงาน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อ-นามสกุล
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  แผนก
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ตำแหน่ง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  อีเมล
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เบอร์โทรศัพท์
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">กำลังโหลด...</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">ไม่พบข้อมูลพนักงาน</td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.emp_code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{employee.emp_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {employee.name?.[0] || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(employee.is_active)}`}>
                        {getStatusText(employee.is_active)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative">
                        <button onClick={() => toggleDropdown(employee.emp_code)} className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {showDropdown === employee.emp_code && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                            <ul className="py-1">
                              <li>
                                <button
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setShowProfileModal(true);
                                  }}
                                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                >
                                  ดูข้อมูล
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => {
                                    setEditEmployee(employee);
                                    setShowEditModal(true);
                                  }}
                                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                >
                                  แก้ไข
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleDeleteClick(employee.emp_code)}
                                  className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                                >
                                  ลบ
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between">
            <div className="text-sm text-gray-700">
              แสดง <span className="font-medium">{filteredEmployees.length > 0 ? 1 : 0}</span> ถึง{' '}
              <span className="font-medium">{filteredEmployees.length}</span> จาก{' '}
              <span className="font-medium">{employees.length}</span> รายการ
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-md mx-4 rounded shadow-lg p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">เพิ่มพนักงานใหม่</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                x
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddEmployee(newEmployee);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">รหัสพนักงาน</label>
                  <input
                    type="text"
                    name="emp_code"
                    onChange={(e) => setNewEmployee({ ...newEmployee, emp_code: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    name="name"
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">แผนก</label>
                  <select
                    name="department"
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    required
                  >
                    <option value="">เลือกแผนก</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">ตำแหน่ง</label>
                  <input
                    type="text"
                    name="position"
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                  <input
                    type="email"
                    name="email"
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    name="phone"
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">วันที่เริ่มงาน</label>
                  <input
                    type="date"
                    name="hire_date"
                    onChange={(e) => setNewEmployee({ ...newEmployee, hire_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-md mx-4 rounded shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">แก้ไขข้อมูลพนักงาน</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateEmployee();
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    value={editEmployee.name}
                    onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    required
                  />
                </div>
                {/* Add other form fields */}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-md mx-4 rounded shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">นำเข้าข้อมูลจาก CSV</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCsvUpload();
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">เลือกไฟล์ CSV</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files[0])}
                    required
                    className="mt-1 block w-full"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCsvModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  อัปโหลด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showProfileModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-md mx-4 rounded shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">รายละเอียดพนักงาน</h2>
            <div className="space-y-3">
              <p><strong>รหัสพนักงาน:</strong> {selectedEmployee.emp_code}</p>
              <p><strong>ชื่อ:</strong> {selectedEmployee.name}</p>
              <p><strong>แผนก:</strong> {selectedEmployee.department || '-'}</p>
              <p><strong>ตำแหน่ง:</strong> {selectedEmployee.position || '-'}</p>
              <p><strong>อีเมล:</strong> {selectedEmployee.email || '-'}</p>
              <p><strong>เบอร์โทรศัพท์:</strong> {selectedEmployee.phone || '-'}</p>
              <p><strong>สถานะ:</strong> {getStatusText(selectedEmployee.is_active)}</p>
              <p><strong>วันที่เริ่มงาน:</strong> {formatDate(selectedEmployee.hire_date)}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setSelectedEmployee(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;