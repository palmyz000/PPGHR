import React, { useState } from 'react';
import EmployeeNavigation from '../../components/EmployeeNavigation';

const EmployeeTimesheet = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('daily');

  // ตัวอย่างข้อมูลการลงเวลา
  const timesheetData = {
    date: '22/01/2025',
    clockIn: '08:30',
    clockOut: '17:30',
    status: 'ปกติ',
    overtime: 2,
    totalHours: 9,
    location: 'สำนักงานใหญ่'
  };

  // ตัวอย่างข้อมูลสรุปประจำเดือน
  const monthlyStats = {
    daysWorked: 22,
    totalHours: 198,
    overtime: 12,
    late: 1,
    absent: 0,
    early: 0,
    workFromHome: 5
  };

  return (
    <div>
      <EmployeeNavigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">ข้อมูลการลงเวลา</h1>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            <button
              className={`py-2 px-4 ${activeTab === 'daily' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('daily')}
            >
              รายวัน
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'monthly' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('monthly')}
            >
              รายเดือน
            </button>
          </div>
        </div>

        {activeTab === 'daily' && (
          <div className="space-y-6">
            {/* Daily Time Record */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">รายละเอียดการทำงาน</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">เวลาเข้างาน</p>
                  <p className="text-lg font-semibold text-blue-600">{timesheetData.clockIn}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">เวลาออกงาน</p>
                  <p className="text-lg font-semibold text-blue-600">{timesheetData.clockOut}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">ชั่วโมงทำงาน</p>
                  <p className="text-lg font-semibold">{timesheetData.totalHours} ชั่วโมง</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">OT</p>
                  <p className="text-lg font-semibold">{timesheetData.overtime} ชั่วโมง</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">สถานะ</p>
                  <p className="text-lg font-semibold">{timesheetData.status}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">สถานที่ทำงาน</p>
                  <p className="text-lg font-semibold">{timesheetData.location}</p>
                </div>
              </div>
            </div>

            {/* Recent History */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">ประวัติย้อนหลัง 7 วัน</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">วันที่</th>
                      <th className="text-center py-2">เวลาเข้า</th>
                      <th className="text-center py-2">เวลาออก</th>
                      <th className="text-center py-2">ชั่วโมงทำงาน</th>
                      <th className="text-center py-2">OT</th>
                      <th className="text-left py-2">สถานที่</th>
                      <th className="text-center py-2">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-2">22/01/2025</td>
                      <td className="text-center">08:30</td>
                      <td className="text-center">17:30</td>
                      <td className="text-center">9</td>
                      <td className="text-center">1</td>
                      <td>สำนักงานใหญ่</td>
                      <td className="text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          ปกติ
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">สรุปประจำเดือน</h2>
              <select className="border rounded-lg px-3 py-2">
                <option>มกราคม 2025</option>
                <option>ธันวาคม 2024</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">วันทำงาน</p>
                <p className="text-2xl font-bold">{monthlyStats.daysWorked} วัน</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">ชั่วโมงทำงานรวม</p>
                <p className="text-2xl font-bold">{monthlyStats.totalHours} ชั่วโมง</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">ชั่วโมง OT รวม</p>
                <p className="text-2xl font-bold">{monthlyStats.overtime} ชั่วโมง</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Work from Home</p>
                <p className="text-2xl font-bold">{monthlyStats.workFromHome} วัน</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">มาสาย</p>
                <p className="text-2xl font-bold">{monthlyStats.late} ครั้ง</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">กลับก่อน</p>
                <p className="text-2xl font-bold">{monthlyStats.early} ครั้ง</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">ขาดงาน</p>
                <p className="text-2xl font-bold">{monthlyStats.absent} วัน</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">ประวัติการลงเวลาทั้งเดือน</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">วันที่</th>
                      <th className="text-center py-2">เวลาเข้า</th>
                      <th className="text-center py-2">เวลาออก</th>
                      <th className="text-center py-2">ชั่วโมงทำงาน</th>
                      <th className="text-center py-2">OT</th>
                      <th className="text-left py-2">สถานที่</th>
                      <th className="text-center py-2">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-2">01/01/2025</td>
                      <td className="text-center">08:30</td>
                      <td className="text-center">17:30</td>
                      <td className="text-center">9</td>
                      <td className="text-center">1</td>
                      <td>สำนักงานใหญ่</td>
                      <td className="text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          ปกติ
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTimesheet;