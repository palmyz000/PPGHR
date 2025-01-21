// ReportsPage.js
import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Calendar, Plus, X } from 'lucide-react';

const ReportsPage = () => {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // New document state
  const [newDocument, setNewDocument] = useState({
    doc_type_name: '',
    description: '',
    access_level: ''
  });

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/api/documents/all');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message || 'Failed to fetch documents');
      }
      
      setDocuments(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/documents/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doc_type_name: newDocument.doc_type_name,
          description: newDocument.description,
          access_level: parseInt(newDocument.access_level)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success === false) {
        throw new Error(result.message || 'Failed to create document');
      }

      setSuccessMessage('เพิ่มประเภทเอกสารสำเร็จ');
      setShowModal(false);
      setNewDocument({
        doc_type_name: '',
        description: '',
        access_level: ''
      });
      await fetchDocuments();
    } catch (error) {
      console.error('Error creating document:', error);
      setError('ไม่สามารถเพิ่มเอกสารได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDocument = async (id, updatedData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/documents/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...updatedData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success === false) {
        throw new Error(result.message || 'Failed to update document');
      }

      setSuccessMessage('อัพเดทข้อมูลสำเร็จ');
      await fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      setError('ไม่สามารถอัพเดทข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchSearch = 
      doc.doc_type_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || doc.access_level?.toString() === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ประเภทเอกสาร</h2>
          <p className="text-sm text-gray-600">จัดการประเภทเอกสารทั้งหมด</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-300"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          เพิ่มประเภทเอกสาร
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาประเภทเอกสาร..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="all">ระดับการเข้าถึงทั้งหมด</option>
              <option value="1">ระดับ 1</option>
              <option value="2">ระดับ 2</option>
              <option value="3">ระดับ 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อประเภทเอกสาร
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  คำอธิบาย
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ระดับการเข้าถึง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่สร้าง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>กำลังโหลด...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.doc_type_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {doc.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        doc.access_level === 1 ? 'bg-green-100 text-green-800' :
                        doc.access_level === 2 ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        ระดับ {doc.access_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(doc.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUpdateDocument(doc.id, {
                          access_level: doc.access_level === 3 ? 1 : doc.access_level + 1
                        })}
                        className="text-blue-600 hover:text-blue-900 disabled:text-blue-300"
                        disabled={loading}
                      >
                        เปลี่ยนระดับ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Document Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">เพิ่มประเภทเอกสาร</h3>
              <button 
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateDocument} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อประเภทเอกสาร
                  </label>
                  <input
                    type="text"
                    required
                    value={newDocument.doc_type_name}
                    onChange={(e) => setNewDocument({ 
                      ...newDocument, 
                      doc_type_name: e.target.value 
                    })}
                    className="w-full p-2 border rounded-lg"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={newDocument.description}
                    onChange={(e) => setNewDocument({ 
                      ...newDocument, 
                      description: e.target.value 
                    })}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ระดับการเข้าถึง
                  </label>
                  <select
                    required
                    value={newDocument.access_level}
                    onChange={(e) => setNewDocument({ 
                      ...newDocument, 
                      access_level: e.target.value 
                    })}
                    className="w-full p-2 border rounded-lg"
                    disabled={loading}
                  >
                    <option value="">เลือกระดับการเข้าถึง</option>
                    <option value="1">ระดับ 1</option>
                    <option value="2">ระดับ 2</option>
                    <option value="3">ระดับ 3</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>กำลังบันทึก...</span>
                    </div>
                  ) : (
                    'บันทึก'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;