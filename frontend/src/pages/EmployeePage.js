import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  ChevronDown,
  MoreVertical,
} from 'lucide-react';

const EmployeePage = () => {
  // States
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const departments = ['IT', 'Marketing', 'Sales', 'Finance', 'HR'];
  const statuses = [
    { value: "1", label: "ทำงาน" },
    { value: "0", label: "ลางาน" },
  ];

  // Fetch employees จาก API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/employees/all');
      const result = await response.json();
      if (result.data && Array.isArray(result.data)) {
        setEmployees(result.data);
      } else {
        console.error('Unexpected API response format');
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter Function
  const filteredEmployees = employees.filter((employee) => {
    const matchDepartment =
      selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchStatus =
      selectedStatus === 'all' || employee.is_active.toString() === selectedStatus;
    const matchSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.emp_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchDepartment && matchStatus && matchSearch;
  });

  // Handle Functions
  const handleAddEmployee = async (newEmployeeData) => {
    try {
      const response = await fetch('http://localhost:8000/api/employees/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployeeData),
      });

      if (response.ok) {
        fetchEmployees(); // Refresh the list
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 1 || status === '1') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    if (status === 1 || status === '1') {
      return 'ทำงาน';
    }
    return 'ลางาน';
  };

  // Format date helper
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">พนักงาน</h1>
          <p className="text-sm text-gray-600">จัดการข้อมูลพนักงานทั้งหมด</p>
        </div>
        <button
          onClick={handleAddEmployee}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มพนักงานใหม่
        </button>
      </div>

      {/* Filters */}
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
              {[...new Set(employees.map(emp => emp.department))].filter(Boolean).map(dept => (
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
              onClick={() => console.log('Import clicked')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="นำเข้าข้อมูล"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={() => console.log('Export clicked')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="ส่งออกข้อมูล"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
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
                  แผนกย่อย
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  อีเมล
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
                  <td colSpan="7" className="px-6 py-4 text-center">กำลังโหลด...</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">ไม่พบข้อมูลพนักงาน</td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.emp_code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.emp_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {employee.name?.[0] || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.department || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.subdepartment || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          employee.is_active
                        )}`}
                      >
                        {getStatusText(employee.is_active)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowProfileModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ดูข้อมูล
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* View Employee Modal */}
      {showProfileModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-md mx-4 rounded shadow-lg p-4 relative">
            <button
              onClick={() => {
                setShowProfileModal(false);
                setSelectedEmployee(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              x
            </button>

            <h2 className="text-xl font-semibold mb-4">รายละเอียดพนักงาน</h2>
            <p>
              <strong>รหัสพนักงาน:</strong> {selectedEmployee.emp_code}
            </p>
            <p>
              <strong>ชื่อ:</strong> {selectedEmployee.name}
            </p>
            <p>
              <strong>แผนก:</strong> {selectedEmployee.department || '-'}
            </p>
            <p>
              <strong>แผนกย่อย:</strong> {selectedEmployee.subdepartment || '-'}
            </p>
            <p>
              <strong>อีเมล:</strong> {selectedEmployee.email || '-'}
            </p>
            <p>
              <strong>สถานะ:</strong> {getStatusText(selectedEmployee.is_active)}
            </p>
            <p>
              <strong>วันที่สร้าง:</strong> {formatDate(selectedEmployee.created_at)}
            </p>
            <p>
              <strong>วันที่อัพเดทล่าสุด:</strong> {formatDate(selectedEmployee.updated_at)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;