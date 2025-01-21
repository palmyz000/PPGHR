import React, { useState } from 'react';
import { Save, Clock, Calculator, Mail, Bank, Lock, UserCog, Building2, FileText } from 'lucide-react';
import PayrollNavigation from '../../components/PayrollNavigation';

const PayrollSettings = () => {
  // ตั้งค่าการคำนวณ
  const [calculationSettings, setCalculationSettings] = useState({
    socialSecurityRate: 5,
    taxCalculationMethod: 'progressive',
    overtimeRate: 1.5,
    holidayRate: 2,
  });

  // ตั้งค่าการจ่ายเงินเดือน
  const [paymentSettings, setPaymentSettings] = useState({
    paymentDate: 25,
    bankTransferDate: 25,
    payslipGenerationDate: 20,
    emailNotificationDate: 21,
  });

  // ตั้งค่าอีเมล
  const [emailSettings, setEmailSettings] = useState({
    senderName: 'HR Payroll',
    senderEmail: 'payroll@company.com',
    emailSubjectTemplate: 'เงินเดือนประจำเดือน {month}',
    emailBodyTemplate: 'เรียน {employee_name}\n\nบริษัทได้โอนเงินเดือนประจำเดือน {month} เข้าบัญชีของท่านเรียบร้อยแล้ว',
  });

  // ตั้งค่าการเข้าถึง
  const [accessSettings, setAccessSettings] = useState({
    canViewSalary: ['HR Manager', 'Finance Manager'],
    canEditSalary: ['HR Manager'],
    canApproveSalary: ['HR Manager', 'Department Manager'],
    canViewReports: ['HR Manager', 'Finance Manager', 'CEO'],
  });

  const handleSaveSettings = (settingType) => {
    console.log('Saving settings:', settingType);
    // Implement API call to save settings
  };

  return (
    <div>
      <PayrollNavigation />
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">ตั้งค่าระบบเงินเดือน</h2>

        {/* การคำนวณ */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">การคำนวณ</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อัตราประกันสังคม (%)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={calculationSettings.socialSecurityRate}
                onChange={(e) => setCalculationSettings({
                  ...calculationSettings,
                  socialSecurityRate: parseFloat(e.target.value)
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วิธีคำนวณภาษี
              </label>
              <select
                className="w-full p-2 border rounded"
                value={calculationSettings.taxCalculationMethod}
                onChange={(e) => setCalculationSettings({
                  ...calculationSettings,
                  taxCalculationMethod: e.target.value
                })}
              >
                <option value="progressive">อัตราก้าวหน้า</option>
                <option value="flat">อัตราคงที่</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อัตรา OT (เท่า)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full p-2 border rounded"
                value={calculationSettings.overtimeRate}
                onChange={(e) => setCalculationSettings({
                  ...calculationSettings,
                  overtimeRate: parseFloat(e.target.value)
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อัตราวันหยุด (เท่า)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full p-2 border rounded"
                value={calculationSettings.holidayRate}
                onChange={(e) => setCalculationSettings({
                  ...calculationSettings,
                  holidayRate: parseFloat(e.target.value)
                })}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSaveSettings('calculation')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              บันทึก
            </button>
          </div>
        </div>

        {/* กำหนดการ */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">กำหนดการ</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันจ่ายเงินเดือน
              </label>
              <input
                type="number"
                min="1"
                max="31"
                className="w-full p-2 border rounded"
                value={paymentSettings.paymentDate}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  paymentDate: parseInt(e.target.value)
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันโอนเงิน
              </label>
              <input
                type="number"
                min="1"
                max="31"
                className="w-full p-2 border rounded"
                value={paymentSettings.bankTransferDate}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  bankTransferDate: parseInt(e.target.value)
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันสร้างสลิปเงินเดือน
              </label>
              <input
                type="number"
                min="1"
                max="31"
                className="w-full p-2 border rounded"
                value={paymentSettings.payslipGenerationDate}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  payslipGenerationDate: parseInt(e.target.value)
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันส่งอีเมลแจ้งเตือน
              </label>
              <input
                type="number"
                min="1"
                max="31"
                className="w-full p-2 border rounded"
                value={paymentSettings.emailNotificationDate}
                onChange={(e) => setPaymentSettings({
                  ...paymentSettings,
                  emailNotificationDate: parseInt(e.target.value)
                })}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSaveSettings('payment')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              บันทึก
            </button>
          </div>
        </div>

        {/* การแจ้งเตือนทางอีเมล */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">การแจ้งเตือนทางอีเมล</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อผู้ส่ง
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={emailSettings.senderName}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  senderName: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อีเมลผู้ส่ง
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={emailSettings.senderEmail}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  senderEmail: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                หัวข้ออีเมล
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={emailSettings.emailSubjectTemplate}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  emailSubjectTemplate: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เนื้อหาอีเมล
              </label>
              <textarea
                rows="4"
                className="w-full p-2 border rounded"
                value={emailSettings.emailBodyTemplate}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  emailBodyTemplate: e.target.value
                })}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSaveSettings('email')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              บันทึก
            </button>
          </div>
        </div>

        {/* การเข้าถึง */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">การเข้าถึง</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(accessSettings).map(([key, roles]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key === 'canViewSalary' && 'สิทธิ์การดูข้อมูลเงินเดือน'}
                  {key === 'canEditSalary' && 'สิทธิ์การแก้ไขเงินเดือน'}
                  {key === 'canApproveSalary' && 'สิทธิ์การอนุมัติเงินเดือน'}
                  {key === 'canViewReports' && 'สิทธิ์การดูรายงาน'}
                </label>
                <select
                  multiple
                  className="w-full p-2 border rounded"
                  value={roles}
                  onChange={(e) => {
                    const selectedRoles = Array.from(e.target.selectedOptions, option => option.value);
                    setAccessSettings({
                      ...accessSettings,
                      [key]: selectedRoles
                    });
                  }}
                >
                  <option value="HR Manager">HR Manager</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Department Manager">Department Manager</option>
                  <option value="CEO">CEO</option>
                </select>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleSaveSettings('access')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollSettings;