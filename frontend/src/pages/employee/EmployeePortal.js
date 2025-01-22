import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, History, FileText, CheckCircle, Settings } from 'lucide-react';
import EmployeeNavigation from '../../components/EmployeeNavigation';

// Card Components
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b">{children}</div>
);

const CardTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 text-xl font-semibold">
    {Icon && <Icon className="h-6 w-6" />}
    {children}
  </div>
);

const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-500 mt-1">{children}</p>
);

const CardContent = ({ children }) => (
  <div className="px-6 py-4">{children}</div>
);

// Button Component
const Button = ({ children, className = '', onClick }) => (
  <button
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Main EmployeePortal Component
const EmployeePortal = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const holidays = [
    { date: '2025-04-13', name: 'สงกรานต์' },
    { date: '2025-04-14', name: 'สงกรานต์' },
    { date: '2025-04-15', name: 'สงกรานต์' },
  ];

  const leaveRequests = [
    { id: 1, type: 'ลาพักร้อน', startDate: '2025-03-01', endDate: '2025-03-03', status: 'อนุมัติ' },
    { id: 2, type: 'ลากิจ', startDate: '2025-04-20', endDate: '2025-04-20', status: 'รออนุมัติ' },
  ];

  const salary = {
    base: 45000,
    bonus: 5000,
    tax: 2500,
    social: 750,
    net: 46750
  };

  const documents = [
    { id: 1, name: 'ขอหนังสือรับรองเงินเดือน', status: 'กำลังดำเนินการ', progress: 70 },
    { id: 2, name: 'ขอเบิกค่ารักษาพยาบาล', status: 'รออนุมัติ', progress: 30 },
  ];

  const handleCheckInOut = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  return (
    <div>
      <EmployeeNavigation />
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">สวัสดี, คุณสมชาย</h1>
            <p className="text-gray-600 mt-2">ยินดีต้อนรับสู่ระบบพนักงาน</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">
              {currentTime.toLocaleDateString('th-TH', { weekday: 'long' })}
            </p>
            <p className="text-gray-600">
              {currentTime.toLocaleDateString('th-TH', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Check In/Out Card */}
          <Card>
            <CardHeader>
              <CardTitle>บันทึกเวลาทำงาน</CardTitle>
              <CardDescription>บันทึกเวลาเข้า-ออกงานประจำวัน</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold mb-6">
                  {currentTime.toLocaleTimeString('th-TH')}
                </p>
                <Button
                  onClick={handleCheckInOut}
                  className={`w-full py-6 text-lg text-white ${
                    isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isCheckedIn ? 'เช็คเอาท์' : 'เช็คอิน'}
                </Button>
                {isCheckedIn && (
                  <p className="mt-4 text-green-600">คุณได้เช็คอินเมื่อเวลา 09:00 น.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Calendar and Leave Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>วันหยุดและการลา</CardTitle>
              <CardDescription>ดูวันหยุดและการลาของคุณ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">วันหยุดที่กำลังจะมาถึง</h3>
                  {holidays.map((holiday, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2 bg-blue-50 p-3 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{holiday.name}</p>
                        <p className="text-sm text-gray-600">{holiday.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">การลาของคุณ</h3>
                  {leaveRequests.map((request) => (
                    <div key={request.id} className="mb-2 bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{request.type}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          request.status === 'อนุมัติ' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {request.startDate} - {request.endDate}
                      </p>
                    </div>
                  ))}
                  <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                    + ขอลางานใหม่
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Card */}
          <Card>
            <CardHeader>
              <CardTitle>สรุปเงินเดือน</CardTitle>
              <CardDescription>ข้อมูลเงินเดือนประจำเดือนเมษายน 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">เงินเดือนพื้นฐาน</span>
                  <span className="text-lg">{salary.base.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">โบนัส</span>
                  <span className="text-lg text-green-600">+{salary.bonus.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ภาษี</span>
                  <span className="text-lg text-red-600">-{salary.tax.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ประกันสังคม</span>
                  <span className="text-lg text-red-600">-{salary.social.toLocaleString()} บาท</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-semibold">รวมสุทธิ</span>
                  <span className="text-2xl font-bold">{salary.net.toLocaleString()} บาท</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>ติดตามสถานะเอกสาร</CardTitle>
              <CardDescription>ติดตามสถานะเอกสารที่คุณยื่นไว้</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{doc.name}</h4>
                      <span className="text-sm text-gray-600">{doc.status}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${doc.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>ความคืบหน้า</span>
                        <span>{doc.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                  <Button className="w-full py-8 text-lg bg-blue-500 hover:bg-blue-600 text-white">
                    + ยื่นเอกสารใหม่
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;