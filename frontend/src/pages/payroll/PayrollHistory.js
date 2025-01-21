import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Filter, FileText } from 'lucide-react';
import PayrollNavigation from '../../components/PayrollNavigation';

const PayrollHistory = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // ข้อมูลตัวอย่างสำหรับกราฟ
  const payrollHistory = [
    { month: 'ม.ค.', total: 1245000, employees: 48, average: 25937.50 },
    { month: 'ก.พ.', total: 1255000, employees: 49, average: 25612.24 },
    { month: 'มี.ค.', total: 1265000, employees: 49, average: 25816.33 },
    { month: 'เม.ย.', total: 1275000, employees: 50, average: 25500.00 },
    { month: 'พ.ค.', total: 1285000, employees: 50, average: 25700.00 },
    { month: 'มิ.ย.', total: 1295000, employees: 51, average: 25392.16 }
  ];

  // ข้อมูลตัวอย่างสำหรับตารางประวัติ
  const historyRecords = [
    {
      date: '25/01/2024',
      period: 'มกราคม 2024',
      employeeCount: 48,
      totalAmount: 1245000,
      status: 'completed',
      documents: ['payslip', 'tax', 'social']
    },
    {
      date: '25/12/2023',
      period: 'ธันวาคม 2023',
      employeeCount: 47,
      totalAmount: 1235000,
      status: 'completed',
      documents: ['payslip', 'tax', 'social']
    },
    {
      date: '25/11/2023',
      period: 'พฤศจิกายน 2023',
      employeeCount: 47,
      totalAmount: 1230000,
      status: 'completed',
      documents: ['payslip', 'tax', 'social']
    }
  ];

  // ฟังก์ชันดาวน์โหลดเอกสาร
  const handleDownload = (type, period) => {
    console.log(`Downloading ${type} for ${period}`);
  };

  // ฟังก์ชันดาวน์โหลดรายงาน
  const handleExport = () => {
    console.log('Exporting report...');
  };

  return (
    <div>
      <PayrollNavigation />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">ประวัติการจ่ายเงินเดือน</h2>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export รายงาน
          </button>
        </div>
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4">
            <div className="w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">ปี</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div className="w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">ทั้งหมด</option>
                <option value="operation">ปฏิบัติการ</option>
                <option value="finance">การเงิน</option>
                <option value="hr">ทรัพยากรบุคคล</option>
              </select>
            </div>
            <div className="w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">พนักงาน</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">ทั้งหมด</option>
                <option value="E001">สมชาย ไทย</option>
                <option value="E002">วิไล คำแสน</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">ยอดรวมเงินเดือน</h3>
            <p className="text-3xl font-bold text-blue-600">฿ 1,245,000</p>
            <p className="text-sm text-gray-500">เฉลี่ย ฿ 25,937 ต่อคน</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">จำนวนพนักงาน</h3>
            <p className="text-3xl font-bold text-green-600">48</p>
            <p className="text-sm text-gray-500">เพิ่มขึ้น 2 คนจากเดือนที่แล้ว</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">การเปลี่ยนแปลง</h3>
            <p className="text-3xl font-bold text-amber-600">+1.2%</p>
            <p className="text-sm text-gray-500">เทียบกับเดือนที่แล้ว</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">แนวโน้มการจ่ายเงินเดือน</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  name="ยอดรวม"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="average"
                  stroke="#16a34a"
                  name="เฉลี่ยต่อคน"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">รายการย้อนหลัง</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">งวด</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนพนักงาน</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">เอกสาร</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historyRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {record.employeeCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {record.totalAmount.toLocaleString()} ฿
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          จ่ายแล้ว
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleDownload('payslip', record.period)}
                            className="text-blue-600 hover:text-blue-900"
                            title="สลิปเงินเดือน"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollHistory;