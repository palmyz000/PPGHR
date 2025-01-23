import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Calendar, DollarSign, Award } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    employeesThisMonth: 0,
    employeesThisYear: 0,
    monthlyStatistics: [],
  });

  const fetchEmployeeStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/employees/statistics');
      const data = await response.json();

      // Map month numbers to English month names
      const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
      ];

      const updatedMonthlyStatistics = data.monthlyStatistics.map((item) => ({
        ...item,
        month: monthNames[item.month - 1], // Convert month number to name
      }));

      setStatistics({
        ...data,
        monthlyStatistics: updatedMonthlyStatistics,
      });
    } catch (error) {
      console.error('Error fetching employee statistics:', error);
    }
  };

  useEffect(() => {
    fetchEmployeeStatistics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto p-6">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">พนักงานทั้งหมด</p>
                <h3 className="text-2xl font-bold text-blue-900">{statistics.totalEmployees} คน</h3>
                <div className="mt-2 text-sm">
                  <span className="text-green-500">+{statistics.employeesThisMonth} คน</span>
                  <span className="text-gray-500 ml-1">เดือนนี้</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">การลาที่รออนุมัติ</p>
                <h3 className="text-2xl font-bold text-blue-900">12 รายการ</h3>
                <div className="mt-2 text-sm text-gray-500">
                  อัพเดทล่าสุด 5 นาทีที่แล้ว
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ค่า OT เดือนนี้</p>
                <h3 className="text-2xl font-bold text-blue-900">฿125,400</h3>
                <div className="mt-2 text-sm">
                  <span className="text-orange-500">+15%</span>
                  <span className="text-gray-500 ml-1">จากเดือนที่แล้ว</span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">การประเมินที่ต้องทำ</p>
                <h3 className="text-2xl font-bold text-blue-900">8 คน</h3>
                <div className="mt-2 text-sm text-red-500">
                  ครบกำหนดภายใน 7 วัน
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <Award className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Details Section */}
        <div className="grid grid-cols-12 gap-6">
          {/* Employee Statistics */}
          <div className="col-span-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">สถิติพนักงาน</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics.monthlyStatistics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" name="พนักงานที่จ้างใหม่" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">งานที่ต้องทำ</h3>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-sm font-medium text-red-800">ประเมินผลการทดลองงาน</div>
                  <div className="text-xs text-red-600 mt-1">ครบกำหนด: 2 วัน</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800">อนุมัติการลาพักร้อน</div>
                  <div className="text-xs text-yellow-600 mt-1">รออนุมัติ: 5 รายการ</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">ต่อสัญญาพนักงาน</div>
                  <div className="text-xs text-blue-600 mt-1">ภายในเดือนนี้: 3 คน</div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">กิจกรรมล่าสุด</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-800">พนักงานใหม่เริ่มงาน</p>
                    <p className="text-xs text-gray-500">15 นาทีที่แล้ว</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-800">อนุมัติการลา</p>
                    <p className="text-xs text-gray-500">1 ชั่วโมงที่แล้ว</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-800">ส่งเอกสารเงินเดือน</p>
                    <p className="text-xs text-gray-500">2 ชั่วโมงที่แล้ว</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
