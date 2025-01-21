import React, { useState, useEffect } from "react";
import { Search, Upload, Download } from "lucide-react";

// ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบ YYYY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const departments = ["IT", "Marketing", "Sales", "Finance", "HR"];
  const statuses = [
    { value: "1", label: "ทำงาน" },
    { value: "0", label: "ลางาน" },
  ];

  // Fetch employees จาก API
  useEffect(() => {
    fetch("http://localhost:8000/api/employees/all")
      .then((res) => res.json())
      .then((response) => {
        console.log("API Response:", response); // ตรวจสอบ API response
        if (response.data && Array.isArray(response.data)) {
          setEmployees(response.data); // ดึงข้อมูลจาก key `data`
        } else {
          console.error("Unexpected API response format");
        }
      })
      .catch((err) => console.error("Error fetching employees:", err.message));
  }, []);

  // ฟิลเตอร์ข้อมูล
  const filteredEmployees = employees.filter((employee) => {
    const matchDepartment =
      selectedDepartment === "all" || employee.department === selectedDepartment;
    const matchStatus =
      selectedStatus === "all" || employee.is_active.toString() === selectedStatus;
    const matchSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.emp_code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDepartment && matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">พนักงาน</h1>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
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

          {/* Dropdown แผนก */}
          <div className="w-48">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="all">แผนกทั้งหมด</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown สถานะ */}
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

          {/* Import/Export Buttons */}
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="นำเข้าข้อมูล">
              <Upload className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="ส่งออกข้อมูล">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
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
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.emp_code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{employee.emp_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.is_active === 1 ? "ทำงาน" : "ลางาน"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-700">
            แสดง <span className="font-medium">{filteredEmployees.length > 0 ? 1 : 0}</span> ถึง{" "}
            <span className="font-medium">{filteredEmployees.length}</span> จาก{" "}
            <span className="font-medium">{employees.length}</span> รายการ
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
              ก่อนหน้า
            </button>
            <button className="px-4 py-2 border rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
