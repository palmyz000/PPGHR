import React from 'react';
import EmployeeNavigation from '../../components/EmployeeNavigation';



const EmployeeDocuments = () => {
  return (
    <div>
      <EmployeeNavigation />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">เอกสารของพนักงาน</h1>
        {/* เพิ่มเนื้อหาส่วนเอกสารที่นี่ */}
      </div>
    </div>
  );
};

export default EmployeeDocuments;