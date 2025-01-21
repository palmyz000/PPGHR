import React from 'react';
import { X } from 'lucide-react';

export const ProfileModal = ({ employee, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">ข้อมูลพนักงาน</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">ข้อมูลทั่วไป</h3>
            <div className="space-y-2">
              <p><span className="font-medium">รหัสพนักงาน:</span> {employee.employeeId}</p>
              <p><span className="font-medium">ชื่อ-นามสกุล:</span> {employee.name}</p>
              <p><span className="font-medium">ตำแหน่ง:</span> {employee.position}</p>
              <p><span className="font-medium">แผนก:</span> {employee.department}</p>
              <p><span className="font-medium">วันที่เริ่มงาน:</span> {employee.startDate}</p>
            </div>

            <h3 className="font-semibold text-lg pt-4">ข้อมูลส่วนตัว</h3>
            <div className="space-y-2">
              <p><span className="font-medium">เลขบัตรประชาชน:</span> {employee.personalId}</p>
              <p><span className="font-medium">การศึกษา:</span> {employee.education}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">ข้อมูลการติดต่อ</h3>
            <div className="space-y-2">
              <p><span className="font-medium">อีเมล:</span> {employee.email}</p>
              <p><span className="font-medium">โทรศัพท์:</span> {employee.phone}</p>
              <p><span className="font-medium">ที่อยู่:</span> {employee.address}</p>
              <p><span className="font-medium">ผู้ติดต่อฉุกเฉิน:</span> {employee.emergencyContact}</p>
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="font-semibold text-lg mb-4">ประวัติการทำงาน</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">ประวัติการปรับเงินเดือน</h4>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left">วันที่</th>
                      <th className="text-left">จำนวนเงิน</th>
                      <th className="text-left">ประเภท</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employee.salary_history?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.amount.toLocaleString()} บาท</td>
                        <td>{item.type === 'initial' ? 'เริ่มงาน' : 'ปรับเงินเดือน'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">ผลการประเมิน</h4>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left">งวด</th>
                      <th className="text-left">คะแนน</th>
                      <th className="text-left">ความคิดเห็น</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employee.evaluations?.map((evaluation , index) => (
                      <tr key={index}>
                        <td>{eval.period}</td>
                        <td>{eval.score}/100</td>
                        <td>{eval.feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);