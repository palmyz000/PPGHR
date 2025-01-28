import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import PayrollNavigation from '../../components/PayrollNavigation';

const PayrollPage = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ทั้งหมด');
  const [selectedMonth, setSelectedMonth] = useState('01'); // เดือนเริ่มต้น
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const departments = ['ทั้งหมด', 'ปฏิบัติการ', 'การเงิน', 'บริหาร', 'การตลาด'];
  const months = [
    { value: '01', label: 'มกราคม' },
    { value: '02', label: 'กุมภาพันธ์' },
    { value: '03', label: 'มีนาคม' },
    { value: '04', label: 'เมษายน' },
    { value: '05', label: 'พฤษภาคม' },
    { value: '06', label: 'มิถุนายน' },
    { value: '07', label: 'กรกฎาคม' },
    { value: '08', label: 'สิงหาคม' },
    { value: '09', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' },
  ];

  useEffect(() => {
    fetchPayrollData();
  }, [selectedMonth]); // ดึงข้อมูลใหม่เมื่อเปลี่ยนเดือน

  const fetchPayrollData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // ดึง token จาก localStorage

      const response = await fetch(`http://localhost:8000/api/payroll/all-payroll?month=${selectedMonth}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ส่ง token ใน Authorization header
        },
      });

      const data = await response.json();

      if (response.ok && data.data) {
        setPayrollData(data.data);
      } else {
        setPayrollData([]);
        setError(data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } catch (error) {
      console.error("Error fetching payroll data:", error);
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      setPayrollData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = payrollData.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.emp_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'ทั้งหมด' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalSummary = filteredData.reduce(
    (acc, curr) => ({
      salary: acc.salary + parseFloat(curr.base_salary || 0),
      ot: acc.ot + parseFloat(curr.ot || 0),
      tax: acc.tax + parseFloat(curr.tax || 0),
      insurance: acc.insurance + parseFloat(curr.insurance || 0),
      total: acc.total + parseFloat(curr.net_salary || 0),
    }),
    { salary: 0, ot: 0, tax: 0, insurance: 0, total: 0 }
  );

  return (
    <div>
      <PayrollNavigation />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">รายงานเงินเดือนประจำเดือน</h2>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </button>
          </div>

          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-4 items-center">
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
                <div className="min-w-[200px]">
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="min-w-[200px]">
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm leading-normal">
                    <th className="py-3 px-4 text-left">รหัส</th>
                    <th className="py-3 px-4 text-left">ชื่อ-นามสกุล</th>
                    <th className="py-3 px-4 text-left">ตำแหน่ง</th>
                    <th className="py-3 px-4 text-left">แผนก</th>
                    <th className="py-3 px-4 text-right">เงินเดือน</th>
                    <th className="py-3 px-4 text-right">OT</th>
                    <th className="py-3 px-4 text-right">ภาษี</th>
                    <th className="py-3 px-4 text-right">ประกันสังคม</th>
                    <th className="py-3 px-4 text-right">รวมสุทธิ</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        กำลังโหลดข้อมูล...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-red-600">
                        {error}
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        ไม่พบข้อมูล
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((employee, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{employee.emp_code}</td>
                        <td className="py-3 px-4">{employee.name}</td>
                        <td className="py-3 px-4">{employee.position}</td>
                        <td className="py-3 px-4">{employee.department}</td>
                        <td className="py-3 px-4 text-right">{parseFloat(employee.base_salary).toLocaleString()} ฿</td>
                        <td className="py-3 px-4 text-right">{parseFloat(employee.ot).toLocaleString()} ฿</td>
                        <td className="py-3 px-4 text-right text-red-600">-{parseFloat(employee.tax).toLocaleString()} ฿</td>
                        <td className="py-3 px-4 text-right text-red-600">-{parseFloat(employee.insurance).toLocaleString()} ฿</td>
                        <td className="py-3 px-4 text-right font-semibold">{parseFloat(employee.net_salary).toLocaleString()} ฿</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-gray-50 font-semibold text-gray-700">
                  <tr>
                    <td colSpan="4" className="py-3 px-4 text-right">
                      รวมทั้งหมด:
                    </td>
                    <td className="py-3 px-4 text-right">{totalSummary.salary.toLocaleString()} ฿</td>
                    <td className="py-3 px-4 text-right">{totalSummary.ot.toLocaleString()} ฿</td>
                    <td className="py-3 px-4 text-right text-red-600">-{totalSummary.tax.toLocaleString()} ฿</td>
                    <td className="py-3 px-4 text-right text-red-600">-{totalSummary.insurance.toLocaleString()} ฿</td>
                    <td className="py-3 px-4 text-right">{totalSummary.total.toLocaleString()} ฿</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;