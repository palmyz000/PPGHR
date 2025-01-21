import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, FileText, ChevronDown } from 'lucide-react';
import PayrollNavigation from '../../components/PayrollNavigation';

const PayrollApproval = () => {
  const [selectedMonth, setSelectedMonth] = useState('202501');
  const [approvalRequests, setApprovalRequests] = useState([
    {
      id: 1,
      type: 'salary_adjustment',
      employee: 'สมชาย ไทย',
      empCode: 'E001',
      department: 'ปฏิบัติการ',
      currentAmount: 25000,
      newAmount: 27000,
      reason: 'ปรับประจำปี',
      requestedBy: 'วิไล คำแสน',
      requestedDate: '2025-01-15',
      status: 'pending',
      approvalFlow: [
        { role: 'หัวหน้าแผนก', status: 'approved', date: '2025-01-16', name: 'นายสมศักดิ์ ใจดี' },
        { role: 'ผู้จัดการฝ่าย', status: 'pending', date: null, name: 'นางสาวรัตนา พัฒนา' },
        { role: 'HR Manager', status: 'pending', date: null, name: 'นายวิชัย บริหาร' }
      ]
    },
    {
      id: 2,
      type: 'bonus',
      employee: 'วิไล คำแสน',
      empCode: 'E002',
      department: 'การเงิน',
      currentAmount: 0,
      newAmount: 15000,
      reason: 'โบนัสประจำปี',
      requestedBy: 'ไพศาล จันทร์มณี',
      requestedDate: '2025-01-14',
      status: 'approved',
      approvalFlow: [
        { role: 'หัวหน้าแผนก', status: 'approved', date: '2025-01-15', name: 'นายวินัย ตรงเวลา' },
        { role: 'ผู้จัดการฝ่าย', status: 'approved', date: '2025-01-16', name: 'นางมณี ศรีสวัสดิ์' },
        { role: 'HR Manager', status: 'approved', date: '2025-01-17', name: 'นายวิชัย บริหาร' }
      ]
    },
    {
      id: 3,
      type: 'salary_adjustment',
      employee: 'จิรา ใจดี',
      empCode: 'E003',
      department: 'การตลาด',
      currentAmount: 28000,
      newAmount: 30000,
      reason: 'ปรับตามผลงาน',
      requestedBy: 'สมศักดิ์ หัวหน้า',
      requestedDate: '2025-01-18',
      status: 'pending',
      approvalFlow: [
        { role: 'หัวหน้าแผนก', status: 'approved', date: '2025-01-19', name: 'นายสมศักดิ์ หัวหน้า' },
        { role: 'ผู้จัดการฝ่าย', status: 'pending', date: null, name: 'นางสาวพรทิพย์ วงศ์สกุล' },
        { role: 'HR Manager', status: 'pending', date: null, name: 'นายวิชัย บริหาร' }
      ]
    }
  ]);

  const handleApprove = (id) => {
    setApprovalRequests(requests =>
      requests.map(request => {
        if (request.id === id) {
          const currentPendingIndex = request.approvalFlow.findIndex(step => step.status === 'pending');
          if (currentPendingIndex !== -1) {
            const newApprovalFlow = [...request.approvalFlow];
            newApprovalFlow[currentPendingIndex] = {
              ...newApprovalFlow[currentPendingIndex],
              status: 'approved',
              date: new Date().toISOString().split('T')[0]
            };
            return {
              ...request,
              status: currentPendingIndex === newApprovalFlow.length - 1 ? 'approved' : 'pending',
              approvalFlow: newApprovalFlow
            };
          }
        }
        return request;
      })
    );
  };

  const handleReject = (id) => {
    setApprovalRequests(requests =>
      requests.map(request =>
        request.id === id
          ? {
            ...request,
            status: 'rejected',
            approvalFlow: request.approvalFlow.map(step =>
              step.status === 'pending'
                ? { ...step, status: 'rejected', date: new Date().toISOString().split('T')[0] }
                : step
            )
          }
          : request
      )
    );
  };

  return (
    <div>
      <PayrollNavigation />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">การอนุมัติเงินเดือน</h2>
          <div className="flex items-center gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="202501">มกราคม 2025</option>
              <option value="202412">ธันวาคม 2024</option>
            </select>
            <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>รออนุมัติ 2 รายการ</span>
            </div>
          </div>
        </div>
  
        {/* Approval Cards */}
        <div className="space-y-4">
          {approvalRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {request.status === 'pending' && (
                        <span className="bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded-full">
                          รออนุมัติ
                        </span>
                      )}
                      {request.status === 'approved' && (
                        <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                          อนุมัติแล้ว
                        </span>
                      )}
                      {request.status === 'rejected' && (
                        <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                          ไม่อนุมัติ
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        รหัสคำขอ: #{request.id}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{request.employee}</h3>
                    <p className="text-sm text-gray-600">
                      แผนก: {request.department} | รหัสพนักงาน: {request.empCode}
                    </p>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        ไม่อนุมัติ
                      </button>
                    </div>
                  )}
                </div>
  
                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">ประเภท</p>
                    <p className="font-medium">
                      {request.type === 'salary_adjustment' ? 'ปรับเงินเดือน' : 'โบนัส'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">จำนวนเงิน</p>
                    <div className="font-medium">
                      {request.currentAmount > 0 && (
                        <span className="text-gray-400 line-through mr-2">
                          {request.currentAmount.toLocaleString()} ฿
                        </span>
                      )}
                      <span className="text-green-600">
                        {request.newAmount.toLocaleString()} ฿
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">เหตุผล</p>
                    <p className="font-medium">{request.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ผู้ขออนุมัติ</p>
                    <p className="font-medium">{request.requestedBy}</p>
                  </div>
                </div>
  
                {/* Approval Flow */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">ขั้นตอนการอนุมัติ</h4>
                  <div className="space-y-3">
                    {request.approvalFlow.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {step.status === 'approved' && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {step.status === 'pending' && <Clock className="w-5 h-5 text-amber-500" />}
                          {step.status === 'rejected' && <XCircle className="w-5 h-5 text-red-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{step.role}</p>
                              <p className="text-sm text-gray-500">{step.name}</p>
                            </div>
                            {step.date && (
                              <span className="text-sm text-gray-500">{step.date}</span>
                            )}
                          </div>
                          {index < request.approvalFlow.length - 1 && (
                            <div className="ml-2 mt-2 h-6 border-l-2 border-gray-200" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayrollApproval;