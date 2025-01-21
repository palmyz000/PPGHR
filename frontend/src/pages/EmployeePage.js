import React, { useState, useEffect } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";

// ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบ YYYY/MM/DD
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    emp_code: "",
    name: "",
    email: "",
    invite_code: "",
    is_active: 1,
    last_active: "",
    position: "",
    department: "",
    hire_date: "",
    user_id: "",
    phone: "",
  });

  // Fetch employees from API
  useEffect(() => {
    fetch("http://localhost:8000/api/employees/all")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data); // ตรวจสอบข้อมูลที่ได้
        if (Array.isArray(data)) {
          setEmployees(data);
        } else if (data.data && Array.isArray(data.data)) {
          setEmployees(data.data); // กรณีที่ข้อมูลอยู่ใน `data` key
        } else {
          throw new Error("Unexpected API response format");
        }
      })
      .catch((err) => console.error("Error fetching employees:", err.message));
  }, []);

  // Add new employee
  const handleAddEmployee = () => {
    const formattedEmployee = {
      ...newEmployee,
      hire_date: newEmployee.hire_date || null,
      invite_code: newEmployee.invite_code || null,
      last_active: newEmployee.last_active || null,
    };

    fetch("http://localhost:8000/api/employees/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedEmployee),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setEmployees((prev) => [...prev, data]); // Update UI
        setShowAddModal(false); // Close modal
        setNewEmployee({
          emp_code: "",
          name: "",
          email: "",
          invite_code: "",
          is_active: 1,
          last_active: "",
          position: "",
          department: "",
          hire_date: "",
          user_id: "",
          phone: "",
        }); // Reset form
      })
      .catch((err) => console.error("Error adding employee:", err.message));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">พนักงาน</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มพนักงานใหม่
        </button>
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
                  อีเมล
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ตำแหน่ง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  แผนก
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่เริ่มงาน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  โทรศัพท์
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(employees) && employees.map((employee) => (
                <tr key={employee.emp_code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{employee.emp_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(employee.hire_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">เพิ่มพนักงานใหม่</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="รหัสพนักงาน"
                value={newEmployee.emp_code}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, emp_code: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="ชื่อ"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="email"
                placeholder="อีเมล"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="ตำแหน่ง"
                value={newEmployee.position}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, position: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="แผนก"
                value={newEmployee.department}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, department: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="date"
                placeholder="วันที่เริ่มงาน"
                value={newEmployee.hire_date}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, hire_date: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="เบอร์โทร"
                value={newEmployee.phone}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, phone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
              <button
                onClick={handleAddEmployee}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;
