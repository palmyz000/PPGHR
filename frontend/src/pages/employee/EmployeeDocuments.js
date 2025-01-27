import React, { useState, useEffect } from 'react';
import EmployeeNavigation from '../../components/EmployeeNavigation';
import { Search, Plus, Download, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const EmployeeDocuments = () => {
  // State declarations
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showPopup, setShowPopup] = useState(false);
  const [docTypes, setDocTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Fetch documents from API
  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem('token'); // JWT เก็บใน LocalStorage

        const response = await axios.get('http://localhost:8000/api/documents/my-doc', {
            headers: {
                Authorization: `Bearer ${token}`, // ส่ง JWT ไปกับ Header
                'Content-Type': 'application/json',
            },
        });

        if (response.data && Array.isArray(response.data.data)) {
            setDocuments(response.data.data); // เซต Documents ที่ได้รับจาก API
        } else {
            throw new Error('รูปแบบข้อมูลไม่ถูกต้อง');
        }
    } catch (error) {
        console.error('Error fetching documents:', error);
        setError('ไม่สามารถโหลดข้อมูลเอกสารได้');
    } finally {
        setIsLoading(false);
    }
};


  // Fetch document types from API
  const fetchDocTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/documents/all-doctype', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setDocTypes(response.data.data);
      } else {
        throw new Error('รูปแบบข้อมูลไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchDocTypes();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchSearch =
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'รอดำเนินการ';
      case 'approved':
        return 'อนุมัติแล้ว';
      case 'rejected':
        return 'ไม่อนุมัติ';
      default:
        return status;
    }
  };

  return (
    <div>
      <EmployeeNavigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">เอกสารของพนักงาน</h1>
            <p className="text-gray-600 mt-1">จัดการเอกสารและติดตามสถานะการดำเนินการ</p>
          </div>
          <button
            onClick={() => setShowPopup(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            ยื่นเอกสารใหม่
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาเอกสาร..."
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-48">
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="approved">อนุมัติแล้ว</option>
                <option value="rejected">ไม่อนุมัติ</option>
              </select>
            </div>

            {/* Export Button */}
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredDocuments.map((doc) => (
              <div key={doc.document_id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{doc.document_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          วันที่ยื่น: {new Date(doc.upload_date).toLocaleDateString('th-TH')}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          กำหนดเสร็จ: {doc.end_time ? new Date(doc.end_time).toLocaleDateString('th-TH') : 'N/A'}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>ผู้อนุมัติ: {doc.approver || '-'}</p>
                        <p>หมายเหตุ: {doc.comment || 'รอการตรวจสอบ'}</p>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(doc.status)}`}>
                    {getStatusText(doc.status)}
                  </span>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                    ดูรายละเอียด
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
                    ติดตามสถานะ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Summary Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-900">เอกสารที่ต้องดำเนินการ</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {documents.filter(doc => doc.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-900">เอกสารที่อนุมัติแล้ว</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {documents.filter(doc => doc.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-900">เอกสารที่ไม่อนุมัติ</h3>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {documents.filter(doc => doc.status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocuments;
