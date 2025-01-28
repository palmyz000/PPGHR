// React Component
import React, { useState, useEffect } from 'react';
import EmployeeNavigation from '../../components/EmployeeNavigation';
import axios from 'axios';

const EmployeePayroll = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/payroll/my-salary', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Add Authorization header
          }
        });
        setSalaryInfo(response.data.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Authorization header missing or invalid.");
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const formatNumber = (num) => parseFloat(num).toLocaleString('th-TH');

  return (
    <div>
      <EmployeeNavigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">เงินเดือน</h1>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b">
            <button
              className={`py-2 px-4 ${activeTab === 'current' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('current')}
            >
              เดือนปัจจุบัน
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('history')}
            >
              ประวัติย้อนหลัง
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('documents')}
            >
              เอกสารเงินเดือน
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'current' && salaryInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* รายได้ */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">รายได้</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>เงินเดือนพื้นฐาน</span>
                  <span>{formatNumber(salaryInfo.base_salary)} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span>เงินเดือนรวม</span>
                  <span>{formatNumber(salaryInfo.gross_salary)} บาท</span>
                </div>
              </div>
            </div>

            {/* รายการหัก */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">รายการหัก</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>ภาษี</span>
                  <span>{formatNumber(salaryInfo.tax)} บาท</span>
                </div>
                <div className="flex justify-between">
                  <span>ประกันสังคม</span>
                  <span>{formatNumber(salaryInfo.insurance)} บาท</span>
                </div>
              </div>
            </div>

            {/* สรุปเงินเดือนสุทธิ */}
            <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">เงินเดือนสุทธิ</h2>
                <span className="text-2xl font-bold text-green-600">
                  {formatNumber(salaryInfo.net_salary)} บาท
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">ประวัติการรับเงินเดือน</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">เดือน</th>
                    <th className="text-right py-2">เงินเดือนรวม</th>
                    <th className="text-right py-2">รายการหัก</th>
                    <th className="text-right py-2">เงินเดือนสุทธิ</th>
                    <th className="text-center py-2">สลิปเงินเดือน</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">ธันวาคม 2024</td>
                    <td className="text-right">52,000</td>
                    <td className="text-right">5,500</td>
                    <td className="text-right">46,500</td>
                    <td className="text-center">
                      <button className="text-blue-600 hover:text-blue-800">ดาวน์โหลด</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">เอกสารเงินเดือน</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">หนังสือรับรองเงินเดือน</h3>
                  <p className="text-sm text-gray-600">สำหรับยื่นขอสินเชื่อหรือวีซ่า</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  ขอเอกสาร
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">หนังสือรับรองการหักภาษี ณ ที่จ่าย</h3>
                  <p className="text-sm text-gray-600">50 ทวิ ประจำปี 2024</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  ดาวน์โหลด
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePayroll;