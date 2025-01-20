// EvaluationPage.js
import React, { useState } from 'react';
import { Search, Plus, ChevronDown, Calendar, MoreVertical, AlertCircle, Clock } from 'lucide-react';

const EvaluationPage = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // ข้อมูลตัวอย่าง
    const evaluations = [
        {
            id: 1,
            employeeName: 'สมชาย ใจดี',
            position: 'โปรแกรมเมอร์',
            department: 'IT',
            evaluationType: 'ประจำปี',
            dueDate: '2025-02-15',
            status: 'pending',
            evaluator: 'วิชัย เก่งกาจ'
        },
        {
            id: 2,
            employeeName: 'สมหญิง รักงาน',
            position: 'นักการตลาด',
            department: 'Marketing',
            evaluationType: 'ทดลองงาน',
            dueDate: '2025-01-25',
            status: 'completed',
            evaluator: 'รัตนา มั่นคง'
        },
        {
            id: 3,
            employeeName: 'ประพันธ์ ดีเลิศ',
            position: 'วิศวกร',
            department: 'Engineering',
            evaluationType: 'ประจำปี',
            dueDate: '2025-02-20',
            status: 'overdue',
            evaluator: 'วิชัย เก่งกาจ'
        }
    ];

    const departments = ['IT', 'Marketing', 'Engineering', 'Sales', 'Finance'];
    const statuses = ['pending', 'completed', 'overdue'];

    // กรองข้อมูล
    const filteredEvaluations = evaluations.filter(evaluation  => {
        const departmentMatch = selectedDepartment === 'all' || evaluation.department === selectedDepartment;
        const statusMatch = selectedStatus === 'all' || evaluation.status === selectedStatus;
        return departmentMatch && statusMatch;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">การประเมิน</h1>
                <p className="text-sm text-gray-600">จัดการการประเมินผลการปฏิบัติงาน</p>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">รอดำเนินการ</p>
                            <h3 className="text-2xl font-bold text-blue-900">8 รายการ</h3>
                            <div className="mt-2 text-sm text-red-500">
                                ครบกำหนดภายใน 7 วัน
                            </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full">
                            <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">เลยกำหนด</p>
                            <h3 className="text-2xl font-bold text-blue-900">2 รายการ</h3>
                            <div className="mt-2 text-sm text-red-500">
                                เร่งด่วน
                            </div>
                        </div>
                        <div className="p-3 bg-red-50 rounded-full">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">ดำเนินการแล้ว</p>
                            <h3 className="text-2xl font-bold text-blue-900">15 รายการ</h3>
                            <div className="mt-2 text-sm text-green-500">
                                เดือนนี้
                            </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full">
                            <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">ทดลองงาน</p>
                            <h3 className="text-2xl font-bold text-blue-900">3 คน</h3>
                            <div className="mt-2 text-sm text-yellow-500">
                                ครบกำหนดเดือนนี้
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-full">
                            <Calendar className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center flex-1">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="ค้นหาการประเมิน..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Department Filter */}
                        <div className="relative">
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">แผนกทั้งหมด</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">สถานะทั้งหมด</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status === 'pending' ? 'รอดำเนินการ' : status === 'completed' ? 'เสร็จสิ้น' : 'เลยกำหนด'}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                    </div>

                    <button 
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        สร้างการประเมินใหม่
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    พนักงาน
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ตำแหน่ง/แผนก
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ประเภทการประเมิน
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    กำหนดส่ง
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ผู้ประเมิน
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    สถานะ
                                </th>
                                <th className="px-6 py-3 relative">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEvaluations.map((evaluation ) => (
                                <tr key={evaluation.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-sm font-medium text-blue-600">
                                                    {evaluation.employeeName.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{evaluation.employeeName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{evaluation.position}</div>
                                        <div className="text-sm text-gray-500">{evaluation.department}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{evaluation.evaluationType}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{evaluation.dueDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{evaluation.evaluator}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            evaluation.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : evaluation.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                        }`}>
                                            {evaluation.status === 'completed' ? 'เสร็จสิ้น' : evaluation.status === 'pending' ? 'รอดำเนินการ' : 'เลยกำหนด'}
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

                {/* Pagination */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                ก่อนหน้า
                            </button>
                            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                ถัดไป
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    แสดง <span className="font-medium">1</span> ถึง <span className="font-medium">3</span> จาก{' '}
                                    <span className="font-medium">12</span> รายการ
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Previous</span>
                                        ก่อนหน้า
                                    </button>
                                    <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        1
                                    </button>
                                    <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        2
                                    </button>
                                    <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        3
                                    </button>
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Next</span>
                                        ถัดไป
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluationPage;