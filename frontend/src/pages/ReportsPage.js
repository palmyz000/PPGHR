import React from 'react';

const ReportsPage = () => {
  // ตัวอย่างข้อมูลรายงาน (สามารถเปลี่ยนแปลงตามความต้องการ)
  const reportData = [
    { id: 1, title: 'รายงานการลา', date: '2025-01-15', status: 'อนุมัติ' },
    { id: 2, title: 'รายงานการประเมินผล', date: '2025-01-14', status: 'รอดำเนินการ' },
    { id: 3, title: 'รายงานการตรวจสอบเงินเดือน', date: '2025-01-13', status: 'เสร็จสิ้น' },
    // เพิ่มข้อมูลรายงานอื่น ๆ ตามที่ต้องการ
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">รายงาน</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {/* ตารางแสดงข้อมูลรายงาน */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">ชื่อรายงาน</th>
              <th className="px-4 py-2 text-left">วันที่</th>
              <th className="px-4 py-2 text-left">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((report) => (
              <tr key={report.id} className="border-t">
                <td className="px-4 py-2">{report.id}</td>
                <td className="px-4 py-2">{report.title}</td>
                <td className="px-4 py-2">{report.date}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      report.status === 'อนุมัติ'
                        ? 'bg-green-100 text-green-700'
                        : report.status === 'เสร็จสิ้น'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
