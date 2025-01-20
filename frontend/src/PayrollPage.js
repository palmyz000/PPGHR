import React from 'react';

const PayrollPage = () => {
  // ตัวอย่างข้อมูลเงินเดือน (สามารถเปลี่ยนแปลงตามความต้องการ)
  const payrollData = [
    { empCode: 'E001', name: 'สมชาย ไทย', position: 'พนักงานทั่วไป', salary: 25000, ot: 2000, total: 27000 },
    { empCode: 'E002', name: 'นางสาววิไล คำแสน', position: 'พนักงานบัญชี', salary: 30000, ot: 2500, total: 32500 },
    { empCode: 'E003', name: 'นายไพศาล จันทร์มณี', position: 'ผู้จัดการแผนก', salary: 45000, ot: 3500, total: 48500 },
    // เพิ่มข้อมูลพนักงานอื่น ๆ ตามที่ต้องการ
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">เงินเดือน</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {/* ตารางแสดงข้อมูลเงินเดือน */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">รหัสพนักงาน</th>
              <th className="px-4 py-2 text-left">ชื่อพนักงาน</th>
              <th className="px-4 py-2 text-left">ตำแหน่ง</th>
              <th className="px-4 py-2 text-right">เงินเดือน</th>
              <th className="px-4 py-2 text-right">OT</th>
              <th className="px-4 py-2 text-right">รวม</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map((employee, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{employee.empCode}</td>
                <td className="px-4 py-2">{employee.name}</td>
                <td className="px-4 py-2">{employee.position}</td>
                <td className="px-4 py-2 text-right">{employee.salary.toLocaleString()} ฿</td>
                <td className="px-4 py-2 text-right">{employee.ot.toLocaleString()} ฿</td>
                <td className="px-4 py-2 text-right">{employee.total.toLocaleString()} ฿</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollPage;
