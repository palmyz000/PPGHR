import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import PayrollNavigation from '../../components/PayrollNavigation';

const PayrollPage = () => {
  const initialPayrollData = [
    { empCode: 'E001', name: 'สมชาย ไทย', position: 'พนักงานทั่วไป', department: 'ปฏิบัติการ', salary: 25000, ot: 2000, allowance: 1000, tax: 500, social: 750, total: 26750 },
    { empCode: 'E002', name: 'นางสาววิไล คำแสน', position: 'พนักงานบัญชี', department: 'การเงิน', salary: 30000, ot: 2500, allowance: 1500, tax: 800, social: 900, total: 32300 },
    { empCode: 'E003', name: 'นายไพศาล จันทร์มณี', position: 'ผู้จัดการแผนก', department: 'บริหาร', salary: 45000, ot: 3500, allowance: 2000, tax: 2500, social: 1350, total: 46650 },
    { empCode: 'E004', name: 'นางสาวพิมพ์ใจ มีสุข', position: 'เจ้าหน้าที่การตลาด', department: 'การตลาด', salary: 28000, ot: 1800, allowance: 1200, tax: 600, social: 840, total: 29560 },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ทั้งหมด');
  const departments = ['ทั้งหมด', 'ปฏิบัติการ', 'การเงิน', 'บริหาร', 'การตลาด'];

  const filteredData = initialPayrollData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.empCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'ทั้งหมด' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalSummary = filteredData.reduce((acc, curr) => ({
    salary: acc.salary + curr.salary,
    ot: acc.ot + curr.ot,
    allowance: acc.allowance + curr.allowance,
    tax: acc.tax + curr.tax,
    social: acc.social + curr.social,
    total: acc.total + curr.total
  }), { salary: 0, ot: 0, allowance: 0, tax: 0, social: 0, total: 0 });

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
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
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
                  <th className="py-3 px-4 text-right">เบี้ยเลี้ยง</th>
                  <th className="py-3 px-4 text-right">ภาษี</th>
                  <th className="py-3 px-4 text-right">ประกันสังคม</th>
                  <th className="py-3 px-4 text-right">รวมสุทธิ</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {filteredData.map((employee, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{employee.empCode}</td>
                    <td className="py-3 px-4">{employee.name}</td>
                    <td className="py-3 px-4">{employee.position}</td>
                    <td className="py-3 px-4">{employee.department}</td>
                    <td className="py-3 px-4 text-right">{employee.salary.toLocaleString()} ฿</td>
                    <td className="py-3 px-4 text-right">{employee.ot.toLocaleString()} ฿</td>
                    <td className="py-3 px-4 text-right">{employee.allowance.toLocaleString()} ฿</td>
                    <td className="py-3 px-4 text-right text-red-600">-{employee.tax.toLocaleString()} ฿</td>
                    <td className="py-3 px-4 text-right text-red-600">-{employee.social.toLocaleString()} ฿</td>
                    <td className="py-3 px-4 text-right font-semibold">{employee.total.toLocaleString()} ฿</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-semibold text-gray-700">
                <tr>
                  <td colSpan="4" className="py-3 px-4 text-right">รวมทั้งหมด:</td>
                  <td className="py-3 px-4 text-right">{totalSummary.salary.toLocaleString()} ฿</td>
                  <td className="py-3 px-4 text-right">{totalSummary.ot.toLocaleString()} ฿</td>
                  <td className="py-3 px-4 text-right">{totalSummary.allowance.toLocaleString()} ฿</td>
                  <td className="py-3 px-4 text-right text-red-600">-{totalSummary.tax.toLocaleString()} ฿</td>
                  <td className="py-3 px-4 text-right text-red-600">-{totalSummary.social.toLocaleString()} ฿</td>
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