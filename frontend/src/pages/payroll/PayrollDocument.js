import React, { useState } from 'react';
import { FileText, Download, Mail, Upload, Search, Filter, Printer } from 'lucide-react';
import PayrollNavigation from '../../components/PayrollNavigation';

const PayrollDocument = () => {
  const [selectedMonth, setSelectedMonth] = useState('202501');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('all');

  const documents = [
    {
      id: 1,
      type: 'payslip',
      title: 'สลิปเงินเดือน',
      employee: 'สมชาย ไทย',
      empCode: 'E001',
      department: 'ปฏิบัติการ',
      period: 'มกราคม 2025',
      status: 'ready',
      generatedDate: '2025-01-20',
      sent: true
    },
    {
      id: 2,
      type: 'tax',
      title: 'หนังสือรับรองการหักภาษี ณ ที่จ่าย',
      employee: 'วิไล คำแสน',
      empCode: 'E002',
      department: 'การเงิน',
      period: '2024',
      status: 'processing',
      generatedDate: '2025-01-20',
      sent: false
    },
    {
      id: 3,
      type: 'certificate',
      title: 'หนังสือรับรองเงินเดือน',
      employee: 'สมชาย ไทย',
      empCode: 'E001',
      department: 'ปฏิบัติการ',
      period: 'มกราคม 2025',
      status: 'ready',
      generatedDate: '2025-01-19',
      sent: true
    }
  ];

  const docTypes = [
    { value: 'all', label: 'เอกสารทั้งหมด' },
    { value: 'payslip', label: 'สลิปเงินเดือน' },
    { value: 'tax', label: 'เอกสารภาษี' },
    { value: 'certificate', label: 'หนังสือรับรอง' }
  ];

  const months = [
    { value: '202501', label: 'มกราคม 2025' },
    { value: '202412', label: 'ธันวาคม 2024' },
    { value: '202411', label: 'พฤศจิกายน 2024' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.empCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedDocType === 'all' || doc.type === selectedDocType;
    return matchesSearch && matchesType;
  });

  const handleGenerateDocument = (type) => {
    console.log('Generating document:', type);
  };

  const handleBulkSendEmail = () => {
    console.log('Sending bulk email');
  };

  const handleSendEmail = (id) => {
    console.log('Sending email for document:', id);
  };

  const handleDownload = (id) => {
    console.log('Downloading document:', id);
  };

  const handlePrint = (id) => {
    console.log('Printing document:', id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ready':
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            พร้อมใช้งาน
          </span>
        );
      case 'processing':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
            กำลังดำเนินการ
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <PayrollNavigation />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">เอกสารเงินเดือน</h2>
          <div className="flex gap-2">
            <button
              onClick={handleBulkSendEmail}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              ส่งอีเมลทั้งหมด
            </button>
            <button
              onClick={() => handleGenerateDocument('all')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              สร้างเอกสารทั้งหมด
            </button>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาพนักงาน..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="min-w-[200px]">
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {docTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[200px]">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">เอกสาร</th>
                  <th className="px-6 py-3">รหัสพนักงาน</th>
                  <th className="px-6 py-3">ชื่อพนักงาน</th>
                  <th className="px-6 py-3">แผนก</th>
                  <th className="px-6 py-3">งวด</th>
                  <th className="px-6 py-3">สถานะ</th>
                  <th className="px-6 py-3">วันที่สร้าง</th>
                  <th className="px-6 py-3">ส่งอีเมล</th>
                  <th className="px-6 py-3">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-sm">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{doc.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{doc.empCode}</td>
                    <td className="px-6 py-4">{doc.employee}</td>
                    <td className="px-6 py-4">{doc.department}</td>
                    <td className="px-6 py-4">{doc.period}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-6 py-4">{doc.generatedDate}</td>
                    <td className="px-6 py-4">
                      {doc.sent ? (
                        <span className="text-green-600">ส่งแล้ว</span>
                      ) : (
                        <span className="text-gray-500">ยังไม่ได้ส่ง</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(doc.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="ดาวน์โหลด"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrint(doc.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="พิมพ์"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendEmail(doc.id)}
                          className="text-green-600 hover:text-green-900"
                          title="ส่งอีเมล"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDocument;