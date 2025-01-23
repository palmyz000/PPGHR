import React, { useState } from 'react';
import { Search, Plus, ChevronDown, Calendar, Clock, FileText, AlertCircle, Check, X, Filter } from 'lucide-react';

// Custom Alert Component
const Alert = ({ children, type = 'info' }) => {
  const types = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    error: 'bg-red-50 border-red-200 text-red-700'
  };
  return (
    <div className={`${types[type]} border rounded-lg p-4`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => (
  <div className="text-sm">
    {children}
  </div>
);

const EvaluationPage = () => {
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const departments = ['IT', 'HR', 'Marketing', 'Finance', 'Sales'];
  const leaveTypes = ['ลาป่วย', 'ลากิจ', 'ลาพักร้อน', 'ลาคลอด'];

  const leaveRequests = [
    {
      id: 1,
      employeeName: 'สมชาย ใจดี',
      employeeId: 'EMP001',
      department: 'IT',
      position: 'Senior Developer',
      leaveType: 'ลาพักร้อน',
      startDate: '2025-02-01',
      endDate: '2025-02-03',
      days: 3,
      reason: 'พักผ่อนกับครอบครัว',
      status: 'pending',
      documents: ['medical.pdf'],
      remainingLeave: 10,
      approver: 'วิชัย เก่งกาจ',
      history: [
        { date: '2025-01-25', action: 'สร้างคำขอลา', by: 'สมชาย ใจดี' }
      ]
    },
    {
      id: 2,
      employeeName: 'สมหญิง รักงาน',
      employeeId: 'EMP002',
      department: 'Marketing',
      position: 'Marketing Manager',
      leaveType: 'ลาป่วย',
      startDate: '2025-02-05',
      endDate: '2025-02-06',
      days: 2,
      reason: 'ไข้หวัดใหญ่',
      status: 'approved',
      documents: ['doctor.pdf'],
      remainingLeave: 8,
      approver: 'รัตนา มั่นคง',
      history: [
        { date: '2025-02-04', action: 'สร้างคำขอลา', by: 'สมหญิง รักงาน' },
        { date: '2025-02-04', action: 'อนุมัติ', by: 'HR Manager' }
      ]
    }
  ];

  const handleApprove = (id) => {
    setShowModal(false);
    addNotification('success', 'อนุมัติการลาเรียบร้อยแล้ว');
  };

  const handleReject = (id) => {
    setShowModal(false);
    addNotification('error', 'ปฏิเสธการลาเรียบร้อยแล้ว');
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const addNotification = (type, message) => {
    const id = new Date().getTime();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const filteredRequests = leaveRequests.filter(request => {
    const typeMatch = selectedLeaveType === 'all' || request.leaveType === selectedLeaveType;
    const statusMatch = selectedStatus === 'all' || request.status === selectedStatus;
    const deptMatch = selectedDepartment === 'all' || request.department === selectedDepartment;
    const searchMatch = searchQuery === '' || 
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && statusMatch && deptMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการการลา</h1>
          <p className="text-sm text-gray-600">ระบบจัดการคำขอลาและอนุมัติการลา</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            สร้างคำขอลา
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">คำขอลารออนุมัติ</p>
              <h3 className="text-2xl font-bold text-blue-900">5 รายการ</h3>
              <div className="mt-2 text-sm text-blue-500">ครบกำหนดวันนี้</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">วันลาพักร้อนคงเหลือเฉลี่ย</p>
              <h3 className="text-2xl font-bold text-green-900">8 วัน</h3>
              <div className="mt-2 text-sm text-green-500">ทั้งบริษัท</div>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">ลาป่วย</p>
              <h3 className="text-2xl font-bold text-red-900">3 คน</h3>
              <div className="mt-2 text-sm text-red-500">วันนี้</div>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">เอกสารรออนุมัติ</p>
              <h3 className="text-2xl font-bold text-yellow-900">2 รายการ</h3>
              <div className="mt-2 text-sm text-yellow-500">ต้องตรวจสอบ</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-medium mb-4">ตัวกรองขั้นสูง</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">แผนก</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="all">ทั้งหมด</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">ช่วงวันที่</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedDepartment('all');
                  setSelectedLeaveType('all');
                  setSelectedStatus('all');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border"
              >
                รีเซ็ตตัวกรอง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Basic Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อหรือรหัสพนักงาน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <div className="relative">
            <select
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8"
            >
              <option value="all">ประเภทการลาทั้งหมด</option>
              {leaveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="pending">รออนุมัติ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="rejected">ไม่อนุมัติ</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">พนักงาน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ประเภทการลา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวนวัน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันลาคงเหลือ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เอกสาร</th>
              <th className="px-6 py-3 relative">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {request.employeeName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                      <div className="text-sm text-gray-500">{request.department}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{request.leaveType}</td>
                <td className="px-6 py-4">
                  <div>{request.startDate}</div>
                  <div className="text-gray-500">ถึง {request.endDate}</div>
                </td>
                <td className="px-6 py-4">{request.days} วัน</td>
                <td className="px-6 py-4">{request.remainingLeave} วัน</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    request.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : request.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {request.status === 'approved' ? 'อนุมัติแล้ว' : 
                     request.status === 'pending' ? 'รออนุมัติ' : 'ไม่อนุมัติ'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {request.documents.length > 0 && (
                    <button className="text-blue-600 hover:text-blue-800">
                      ดูเอกสาร ({request.documents.length})
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleViewDetails(request)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      รายละเอียด
                    </button>
                    {request.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApprove(request.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded-full"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleReject(request.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approval Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">รายละเอียดการลา</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">พนักงาน</label>
                  <p>{selectedRequest.employeeName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">รหัสพนักงาน</label>
                  <p>{selectedRequest.employeeId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">แผนก</label>
                  <p>{selectedRequest.department}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">ตำแหน่ง</label>
                  <p>{selectedRequest.position}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">ประเภทการลา</label>
                  <p>{selectedRequest.leaveType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">จำนวนวัน</label>
                  <p>{selectedRequest.days} วัน</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">วันที่ลา</label>
                  <p>{selectedRequest.startDate} ถึง {selectedRequest.endDate}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">เหตุผลการลา</label>
                  <p>{selectedRequest.reason}</p>
                </div>
                {selectedRequest.documents.length > 0 && (
                  <div className="col-span-2">
                    <label className="text-sm text-gray-500">เอกสารแนบ</label>
                    <div className="mt-1 space-y-1">
                      {selectedRequest.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{doc}</span>
                          <button className="text-blue-600 hover:text-blue-800">ดาวน์โหลด</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">ประวัติการดำเนินการ</label>
                  <div className="mt-2 space-y-2">
                    {selectedRequest.history.map((item, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-gray-600">{item.date}</span> - {item.action} โดย {item.by}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {selectedRequest.status === 'pending' && (
                <>
                  <div>
                    <label className="text-sm text-gray-500">หมายเหตุการอนุมัติ</label>
                    <textarea 
                      className="w-full border rounded-lg p-2 mt-1"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      ปิด
                    </button>
                    <button 
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      อนุมัติ
                    </button>
                    <button 
                      onClick={() => handleReject(selectedRequest.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      ไม่อนุมัติ
                    </button>
                  </div>
                </>
              )}
              {selectedRequest.status !== 'pending' && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    ปิด
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {notifications.map(notification => (
          <Alert key={notification.id} type={notification.type}>
            <AlertDescription>
              {notification.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default EvaluationPage;