import React, { useState, useEffect } from 'react';
import EmployeeNavigation from '../../components/EmployeeNavigation';
import { Search, Filter, Plus, Download, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const EmployeeDocuments = () => {
  // State declarations
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showPopup, setShowPopup] = useState(false);
  const [docTypes, setDocTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    document_name: '',
    description: '',
    doc_type_name: '', // Use doc_type_name to match API
    status: 'pending'
  });

  const [documents, setDocuments] = useState([]);

  // Fetch document types
  const fetchDocTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/documents/all-doctype', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('API Response:', response.data);
  
      if (response.data && Array.isArray(response.data.data)) {
        setDocTypes(response.data.data);
      } else {
        throw new Error('รูปแบบข้อมูลไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
      setError('ไม่สามารถโหลดประเภทเอกสารได้');
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchDocTypes();
  }, []);

  // Handle adding new document
  const handleAddDocument = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!formData.doc_type_name) {
        throw new Error('กรุณาเลือกประเภทเอกสาร');
      }

      const documentData = {
        document_name: formData.document_name,
        description: formData.description,
        doc_type_name: formData.doc_type_name,
        file_path: null
      };

      const response = await axios.post(
        'http://localhost:8000/api/documents/add-doc',
        documentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data) {
        const newDoc = {
          id: response.data.document_id,
          type: formData.doc_type_name,
          requestDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          description: formData.description,
          approver: '-',
          comment: 'รอการตรวจสอบ'
        };

        setDocuments(prevDocs => [newDoc, ...prevDocs]);
        setShowPopup(false);
        setFormData({
          document_name: '',
          description: '',
          doc_type_name: '',
          status: 'pending'
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'ไม่สามารถเพิ่มเอกสารได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const filteredDocuments = documents.filter(doc => {
    const matchSearch = doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    const matchType = selectedType === 'all' || doc.type === selectedType;
    return matchSearch && matchStatus && matchType;
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

  const AddDocumentForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">ยื่นเอกสารใหม่</h2>
        <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อเอกสาร
          </label>
          <input
            type="text"
            name="document_name"
            value={formData.document_name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอกชื่อเอกสาร"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            คำอธิบาย
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอกรายละเอียดเอกสาร"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ประเภทเอกสาร
          </label>
          {isLoading ? (
            <div className="w-full p-2 border rounded-lg bg-gray-50">
              กำลังโหลดข้อมูล...
            </div>
          ) : (
            <select
              name="doc_type_name"
              value={formData.doc_type_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">เลือกประเภทเอกสาร</option>
              {docTypes.map((type) => (
                <option key={type.doc_type_id} value={type.doc_type_name}>
                  {type.doc_type_name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => setShowPopup(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleAddDocument}
          disabled={!formData.document_name || !formData.description || !formData.doc_type_name || isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'กำลังโหลด...' : 'บันทึก'}
        </button>
      </div>
    </div>
  );

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
          <button onClick={() => setShowPopup(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
              <div key={doc.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{doc.type}</h3>
                      <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          วันที่ยื่น: {new Date(doc.requestDate).toLocaleDateString('th-TH')}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          กำหนดเสร็จ: {new Date(doc.deadline).toLocaleDateString('th-TH')}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>ผู้อนุมัติ: {doc.approver}</p>
                        <p>หมายเหตุ: {doc.comment}</p>
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

        {/* Add Document Modal */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <AddDocumentForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDocuments;
