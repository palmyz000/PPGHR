import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import PayrollNavigation from '../../components/PayrollNavigation';

const PayrollStructure = () => {
  const [structures, setStructures] = useState([
    {
      id: 1,
      position: 'พนักงานทั่วไป',
      department: 'ปฏิบัติการ',
      base: 15000,
      allowances: [
        { name: 'ค่าตำแหน่ง', amount: 1000 },
        { name: 'ค่าเดินทาง', amount: 800 }
      ],
      deductions: [
        { name: 'ประกันสังคม', percentage: 5 },
        { name: 'ภาษี', percentage: 3 }
      ]
    },
    {
      id: 2,
      position: 'ผู้จัดการ',
      department: 'บริหาร',
      base: 35000,
      allowances: [
        { name: 'ค่าตำแหน่ง', amount: 5000 },
        { name: 'ค่าเดินทาง', amount: 2000 }
      ],
      deductions: [
        { name: 'ประกันสังคม', percentage: 5 },
        { name: 'ภาษี', percentage: 10 }
      ]
    }
  ]);

  const [editMode, setEditMode] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);

  const handleEdit = (structure) => {
    setSelectedStructure({ ...structure });
    setEditMode(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบโครงสร้างเงินเดือนนี้?')) {
      setStructures(structures.filter(s => s.id !== id));
    }
  };

  const calculateTotal = (structure) => {
    const totalAllowances = structure.allowances.reduce((sum, a) => sum + a.amount, 0);
    const totalDeductions = structure.deductions.reduce((sum, d) => sum + (structure.base * d.percentage / 100), 0);
    return structure.base + totalAllowances - totalDeductions;
  };

  return (
    <div>
      <PayrollNavigation />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">โครงสร้างเงินเดือน</h2>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            สร้างโครงสร้างใหม่
          </button>
        </div>

        {/* Grid of Structure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {structures.map((structure) => (
            <div key={structure.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {structure.position}
                  </h3>
                  <p className="text-sm text-gray-500">
                    แผนก: {structure.department}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(structure)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(structure.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* เงินเดือนพื้นฐาน */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">เงินเดือนพื้นฐาน</p>
                  <p className="text-lg font-medium">{structure.base.toLocaleString()} ฿</p>
                </div>

                {/* รายการเพิ่ม */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">รายการเพิ่ม</p>
                  <div className="space-y-2">
                    {structure.allowances.map((allowance, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{allowance.name}</span>
                        <span className="font-medium">{allowance.amount.toLocaleString()} ฿</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* รายการหัก */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">รายการหัก</p>
                  <div className="space-y-2">
                    {structure.deductions.map((deduction, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{deduction.name}</span>
                        <span className="font-medium text-red-600">{deduction.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ยอดรวมสุทธิ */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">ประมาณการสุทธิ</p>
                    <p className="text-lg font-semibold text-green-600">
                      {calculateTotal(structure).toLocaleString()} ฿
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal สำหรับแก้ไข */}
        {editMode && selectedStructure && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">แก้ไขโครงสร้างเงินเดือน</h3>
                <button onClick={() => setEditMode(false)} className="p-2 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ตำแหน่ง
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={selectedStructure.position}
                    onChange={(e) => setSelectedStructure({
                      ...selectedStructure,
                      position: e.target.value
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    แผนก
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={selectedStructure.department}
                    onChange={(e) => setSelectedStructure({
                      ...selectedStructure,
                      department: e.target.value
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เงินเดือนพื้นฐาน
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={selectedStructure.base}
                    onChange={(e) => setSelectedStructure({
                      ...selectedStructure,
                      base: Number(e.target.value)
                    })}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => {
                      setStructures(structures.map(s =>
                        s.id === selectedStructure.id ? selectedStructure : s
                      ));
                      setEditMode(false);
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollStructure;