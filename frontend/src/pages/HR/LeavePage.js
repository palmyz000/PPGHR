import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, MoreVertical, Plus, Clock, Calendar } from 'lucide-react';

const LeavePage = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/documents/all-doctype', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Leave Types Response:', response.data);
        setLeaveTypes(response.data.data);
      } catch (error) {
        console.error('Error fetching leave types:', error);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลประเภทการลา');
      }
    };

    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/documents/all-doc', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const formattedData = response.data.data.map((doc) => ({
          id: doc.document_id,
          employeeName: `พนักงาน ID: ${doc.uploaded_by}`,
          type: doc.doc_type_name || 'ไม่ระบุ',
          startDate: doc.start_time?.split('T')[0],
          endDate: doc.end_time?.split('T')[0],
          days: calculateDays(doc.start_time, doc.end_time),
          status: doc.status,
          reason: doc.description,
          requestDate: doc.upload_date.split('T')[0]
        }));
        setLeaveRequests(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leave requests:', err);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลคำขอลา');
        setLoading(false);
      }
    };

    fetchLeaveTypes();
    fetchLeaveRequests();
  }, []);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  const statuses = ['pending', 'approved', 'rejected'];

  const filteredLeaves = leaveRequests.filter((leave) => {
    const statusMatch = selectedStatus === 'all' || leave.status === selectedStatus;
    const typeMatch = selectedType === 'all' || leave.type === selectedType;
    return statusMatch && typeMatch;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">การลา</h1>
          <p className="text-sm text-gray-600">จัดการคำขอลาและอนุมัติการลา</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          ขอลาใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">รออนุมัติ</p>
              <h3 className="text-2xl font-bold text-blue-900">{leaveRequests.filter((leave) => leave.status === 'pending').length} รายการ</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-1">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="ค้นหาการลา..."
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">ประเภทการลาทั้งหมด</option>
                {leaveTypes.map((type) => (
                  <option key={type.doc_type_id} value={type.doc_type_name}>{type.doc_type_name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">สถานะทั้งหมด</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>{status === 'pending' ? 'รออนุมัติ' : status === 'approved' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">พนักงาน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภทการลา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ลา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนวัน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เหตุผล</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ขอลา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{leave.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{leave.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{leave.startDate} - {leave.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{leave.days} วัน</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{leave.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{leave.requestDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      leave.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : leave.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {leave.status === 'approved' ? 'อนุมัติแล้ว' : leave.status === 'pending' ? 'รออนุมัติ' : 'ไม่อนุมัติ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeavePage;