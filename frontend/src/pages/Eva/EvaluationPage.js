import React, { useState } from 'react';
import { Search, Plus, ChevronDown, Calendar, Clock, FileText, AlertCircle, Check, X, Filter, Download, Users, Star } from 'lucide-react';

// Custom Alert Component 
const Alert = ({ children, type = 'info' }) => {
 const types = {
   info: 'bg-blue-50 border-blue-200 text-blue-700',
   success: 'bg-green-50 border-green-200 text-green-700',
   warning: 'bg-yellow-50 border-yellow-200 text-yellow-700', 
   error: 'bg-red-50 border-red-200 text-red-700'
 };
 return (
   <div className={`${types[type]} border rounded-lg p-4`}>
     {children}
   </div>
 );
};

const AlertDescription = ({ children }) => (
 <div className="text-sm">
   {children}
 </div>
);

// Role and Evaluation Criteria Management
const userRoles = {
 HR_ADMIN: 'hr_admin',
 HR_MANAGER: 'hr_manager',
 DEPARTMENT_HEAD: 'department_head',
 EMPLOYEE: 'employee'
};

const evaluationCriteria = {
 ความรับผิดชอบ: {
   maxScore: 5,
   weight: 20,
   required: true
 },
 การทำงานเป็นทีม: {
   maxScore: 5,
   weight: 20, 
   required: true
 },
 คุณภาพงาน: {
   maxScore: 5,
   weight: 30,
   required: true
 },
 ความคิดริเริ่ม: {
   maxScore: 5,
   weight: 15,
   required: true
 },
 การพัฒนาตนเอง: {
   maxScore: 5,
   weight: 15,
   required: true
 }
};

const EvaluationPage = () => {
 const [selectedPeriod, setSelectedPeriod] = useState('all');
 const [selectedStatus, setSelectedStatus] = useState('all');
 const [selectedDepartment, setSelectedDepartment] = useState('all');
 const [showModal, setShowModal] = useState(false);
 const [selectedEvaluation, setSelectedEvaluation] = useState(null);
 const [searchQuery, setSearchQuery] = useState('');
 const [showFilters, setShowFilters] = useState(false);
 const [notifications, setNotifications] = useState([]);
 const [userRole, setUserRole] = useState(userRoles.HR_ADMIN);
 const [showCriteriaModal, setShowCriteriaModal] = useState(false);
 const [bulkSelected, setBulkSelected] = useState([]);

 const departments = ['IT', 'HR', 'Marketing', 'Finance', 'Sales'];
 const periods = ['2025-Q1', '2024-Q4', '2024-Q3', '2024-Q2'];

 const [evaluations, setEvaluations] = useState([
   {
     id: 1,
     employeeName: 'สมชาย ใจดี',
     employeeId: 'EMP001',
     department: 'IT',
     position: 'Senior Developer', 
     evaluationPeriod: '2025-Q1',
     scores: {
       ความรับผิดชอบ: 4.5,
       การทำงานเป็นทีม: 4.0,
       คุณภาพงาน: 4.2,
       ความคิดริเริ่ม: 3.8,
       การพัฒนาตนเอง: 4.0
     },
     totalScore: 4.1,
     status: 'pending',
     feedback: 'มีความรับผิดชอบสูง ทำงานได้ตามเป้าหมาย',
     evaluator: 'วิชัย เก่งกาจ',
     created: '2025-01-20',
     documents: ['performance.pdf'],
     history: [
       { date: '2025-01-20', action: 'สร้างแบบประเมิน', by: 'HR Manager' }
     ]
   }
 ]);

 // Evaluation Management Functions
 const handleEvaluate = (id, scores, feedback) => {
   const total = Object.entries(scores).reduce((acc, [criteria, score]) => {
     return acc + (score * evaluationCriteria[criteria].weight / 100);
   }, 0);

   setEvaluations(prev =>
     prev.map(eva =>
       eva.id === id 
         ? { 
             ...eva, 
             scores,
             totalScore: total,
             feedback,
             status: 'completed',
             history: [
               ...eva.history,
               { 
                 date: new Date().toISOString().split('T')[0],
                 action: 'ประเมินเสร็จสิ้น',
                 by: 'HR Manager'
               }
             ]
           }
         : eva
     )
   );

   addNotification('success', 'บันทึกการประเมินเรียบร้อย');
 };

 const handleBulkApprove = (ids) => {
   ids.forEach(id => {
     handleEvaluate(id, 
       evaluations.find(e => e.id === id).scores,
       'Bulk approved'
     );
   });
   setBulkSelected([]);
 };

 const handleViewDetails = (evaluation) => {
   setSelectedEvaluation(evaluation);
   setShowModal(true);
 };

 const addNotification = (type, message) => {
   const id = new Date().getTime();
   setNotifications(prev => [...prev, { id, type, message }]);
   setTimeout(() => {
     setNotifications(prev => prev.filter(n => n.id !== id));
   }, 5000);
 };

 const generateReport = () => {
   const report = {
     totalEvaluations: evaluations.length,
     completedEvaluations: evaluations.filter(e => e.status === 'completed').length,
     departmentStats: {},
     averageScores: {}
   };
   return report;
 };

 const filteredEvaluations = evaluations.filter(evaluation => {
   const periodMatch = selectedPeriod === 'all' || evaluation.evaluationPeriod === selectedPeriod;
   const statusMatch = selectedStatus === 'all' || evaluation.status === selectedStatus;
   const deptMatch = selectedDepartment === 'all' || evaluation.department === selectedDepartment;
   const searchMatch = searchQuery === '' || 
     evaluation.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     evaluation.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
   
   return periodMatch && statusMatch && deptMatch && searchMatch;
 });

 // Evaluation Components
 const CriteriaManagementModal = () => (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
     <div className="bg-white rounded-lg p-6 max-w-lg w-full">
       <h3 className="text-lg font-bold mb-4">จัดการเกณฑ์การประเมิน</h3>
       <div className="space-y-4">
         {Object.entries(evaluationCriteria).map(([criteria, config]) => (
           <div key={criteria} className="flex justify-between items-center">
             <span>{criteria}</span>
             <div className="flex gap-2">
               <input 
                 type="number"
                 className="border rounded px-2 py-1 w-20"
                 defaultValue={config.weight}
               />
               <span>%</span>
             </div>
           </div>
         ))}
       </div>
       <div className="mt-4 flex justify-end gap-2">
         <button
           onClick={() => setShowCriteriaModal(false)}
           className="px-4 py-2 border rounded-lg"
         >
           ยกเลิก
         </button>
         <button 
           className="px-4 py-2 bg-blue-600 text-white rounded-lg"
         >
           บันทึก
         </button>
       </div>
     </div>
   </div>
 );

 const ScoreInput = ({ criteria, score, onChange }) => (
   <div className="flex items-center gap-2">
     {[1,2,3,4,5].map(value => (
       <button
         key={value}
         onClick={() => onChange(criteria, value)}
         className={`p-1 rounded-full ${
           score >= value ? 'text-yellow-400' : 'text-gray-300'
         }`}
       >
         <Star className="w-6 h-6 fill-current" />
       </button>
     ))}
   </div>
 );

 const HRControls = () => (
   <div className="flex gap-2 mb-4">
     {userRole === userRoles.HR_ADMIN && (
       <>
         <button
           onClick={() => setShowCriteriaModal(true)}
           className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
         >
           <Users className="w-4 h-4 mr-2 inline" />
           จัดการเกณฑ์การประเมิน
         </button>
         <button
           onClick={() => generateReport()}
           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
         >
           <Download className="w-4 h-4 mr-2 inline" />
           รายงานสรุปผล
         </button>
       </>
     )}
     {bulkSelected.length > 0 && (
       <button
         onClick={() => handleBulkApprove(bulkSelected)}
         className="px-4 py-2 bg-blue-600 text-white rounded-lg"
       >
         อนุมัติที่เลือก ({bulkSelected.length})
       </button>
     )}
   </div>
 );

 return (
   <div className="min-h-screen bg-gray-50 p-6">
     {/* Header */}
     <div className="mb-6 flex justify-between items-center">
       <div>
         <h1 className="text-2xl font-bold text-gray-900">การประเมินผลการปฏิบัติงาน</h1>
         <p className="text-sm text-gray-600">ระบบจัดการการประเมินผลพนักงาน</p>
       </div>
       <div className="flex gap-2">
         <button 
           onClick={() => setShowFilters(!showFilters)}
           className="px-4 py-2 border rounded-lg hover:bg-gray-50"
         >
           <Filter className="w-5 h-5" />
         </button>
         <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
           <Plus className="w-4 h-4 mr-2" />
           สร้างแบบประเมินใหม่
         </button>
       </div>
     </div>

     {/* HR Controls */}
     {userRole !== userRoles.EMPLOYEE && <HRControls />}

     {/* Quick Stats */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
       <div className="bg-white rounded-xl shadow-md p-6">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-600">การประเมินที่รอดำเนินการ</p>
             <h3 className="text-2xl font-bold text-blue-900">
               {evaluations.filter(e => e.status === 'pending').length} รายการ
             </h3>
             <div className="mt-2 text-sm text-blue-500">ต้องประเมินภายในเดือนนี้</div>
           </div>
           <div className="p-3 bg-blue-50 rounded-full">
             <Clock className="h-6 w-6 text-blue-600" />
           </div>
         </div>
       </div>

       <div className="bg-white rounded-xl shadow-md p-6">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-600">คะแนนเฉลี่ยรวม</p>
             <h3 className="text-2xl font-bold text-green-900">
               {(evaluations.reduce((acc, curr) => acc + curr.totalScore, 0) / evaluations.length).toFixed(2)}
             </h3>
             <div className="mt-2 text-sm text-green-500">จากคะแนนเต็ม 5.00</div>
           </div>
           <div className="p-3 bg-green-50 rounded-full">
             <Star className="h-6 w-6 text-green-600" />
           </div>
         </div>
       </div>

       <div className="bg-white rounded-xl shadow-md p-6">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-600">ประเมินเสร็จสิ้น</p>
             <h3 className="text-2xl font-bold text-red-900">
               {evaluations.filter(e => e.status === 'completed').length} รายการ
             </h3>
             <div className="mt-2 text-sm text-red-500">ในไตรมาสนี้</div>
           </div>
           <div className="p-3 bg-red-50 rounded-full">
             <Check className="h-6 w-6 text-red-600" />
           </div>
         </div>
       </div>

       <div className="bg-white rounded-xl shadow-md p-6">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-sm text-gray-600">เอกสารประกอบ</p>
             <h3 className="text-2xl font-bold text-yellow-900">
               {evaluations.reduce((acc, curr) => acc + curr.documents.length, 0)} รายการ
             </h3>
             <div className="mt-2 text-sm text-yellow-500">ต้องตรวจสอบ</div>
           </div>
           <div className="p-3 bg-yellow-50 rounded-full">
             <FileText className="h-6 w-6 text-yellow-600" />
           </div>
         </div>
       </div>
     </div>

     {/* Advanced Filters */}
     {showFilters && (
       <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
         <h3 className="font-medium mb-4">ตัวกรองขั้นสูง</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
             <label className="block text-sm text-gray-600 mb-2">แผนก</label>
             <select
               value={selectedDepartment}
               onChange={(e) => setSelectedDepartment(e.target.value)}
               className="w-full border rounded-lg px-3 py-2"
             >
               <option value="all">ทั้งหมด</option>
               {departments.map(dept => (
                 <option key={dept} value={dept}>{dept}</option>
               ))}
             </select>
           </div>
           <div>
             <label className="block text-sm text-gray-600 mb-2">รอบประเมิน</label>
             <select
               value={selectedPeriod}
               onChange={(e) => setSelectedPeriod(e.target.value)}
               className="w-full border rounded-lg px-3 py-2"
             >
               <option value="all">ทั้งหมด</option>
               {periods.map(period => (
                 <option key={period} value={period}>{period}</option>
               ))}
             </select>
           </div>
           <div className="flex items-end">
             <button
               onClick={() => {
                 setSelectedDepartment('all');
                 setSelectedPeriod('all');
                 setSelectedStatus('all');
               }}
               className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg border"
             >
               รีเซ็ตตัวกรอง
             </button>
           </div>
         </div>
       </div>
     )}

     {/* Search and Basic Filters */}
     <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
       <div className="flex flex-wrap gap-4 items-center">
         <div className="relative flex-1 max-w-md">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
           <input
             type="text"
             placeholder="ค้นหาด้วยชื่อหรือรหัสพนักงาน..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-10 pr-4 py-2 border rounded-lg"
           />
         </div>

         <div className="relative">
           <select
             value={selectedStatus}
             onChange={(e) => setSelectedStatus(e.target.value)}
             className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8"
           >
             <option value="all">สถานะทั้งหมด</option>
             <option value="pending">รอประเมิน</option>
             <option value="completed">ประเมินแล้ว</option>
           </select>
           <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
         </div>
       </div>
     </div>

     {/* Evaluation Table */}
     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
       <table className="min-w-full divide-y divide-gray-200">
         <thead className="bg-gray-50">
           <tr>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">พนักงาน</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">แผนก</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รอบประเมิน</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">คะแนนรวม</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้ประเมิน</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เอกสาร</th>
             <th className="px-6 py-3 relative">
               <span className="sr-only">Actions</span>
             </th>
           </tr>
         </thead>
         <tbody className="bg-white divide-y divide-gray-200">
           {filteredEvaluations.map((evaluation) => (
             <tr key={evaluation.id} className="hover:bg-gray-50">
               <td className="px-6 py-4">
                 <div className="flex items-center">
                   <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                     <span className="text-sm font-medium text-blue-600">
                       {evaluation.employeeName.charAt(0)}
                     </span>
                   </div>
                   <div className="ml-4">
                     <div className="text-sm font-medium text-gray-900">{evaluation.employeeName}</div>
                     <div className="text-sm text-gray-500">{evaluation.employeeId}</div>
                   </div>
                 </div>
               </td>
               <td className="px-6 py-4">{evaluation.department}</td>
               <td className="px-6 py-4">{evaluation.evaluationPeriod}</td>
               <td className="px-6 py-4">
                 <div className="flex items-center">
                   <span className="text-sm font-medium">{evaluation.totalScore}</span>
                   <span className="text-gray-400 ml-1">/5.00</span>
                 </div>
               </td>
               <td className="px-6 py-4">
                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                   evaluation.status === 'completed'
                     ? 'bg-green-100 text-green-800'
                     : 'bg-yellow-100 text-yellow-800'
                 }`}>
                   {evaluation.status === 'completed' ? 'ประเมินแล้ว' : 'รอประเมิน'}
                 </span>
               </td>
               <td className="px-6 py-4">{evaluation.evaluator}</td>
               <td className="px-6 py-4">
                 {evaluation.documents.length > 0 && (
                   <button className="text-blue-600 hover:text-blue-800">
                     ดูเอกสาร ({evaluation.documents.length})
                   </button>
                 )}
               </td>
               <td className="px-6 py-4 text-right">
                 <button 
                   onClick={() => handleViewDetails(evaluation)}
                   className="text-blue-600 hover:text-blue-800"
                 >
                   {evaluation.status === 'pending' ? 'ประเมิน' : 'ดูรายละเอียด'}
                 </button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>

     {/* Evaluation Modal */}
     {showModal && selectedEvaluation && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
           <h3 className="text-lg font-bold mb-4">แบบประเมินผลการปฏิบัติงาน</h3>
           <div className="space-y-6">
             {/* Employee Info */}
             <div className="grid grid-cols-2 gap-4 border-b pb-4">
               <div>
                 <div className="mb-4">
                   <label className="text-sm text-gray-500">พนักงาน</label>
                   <p className="font-medium">{selectedEvaluation.employeeName}</p>
                 </div>
                 <div>
                   <label className="text-sm text-gray-500">ตำแหน่ง</label>
                   <p>{selectedEvaluation.position}</p>
                 </div>
               </div>
               <div>
                 <div className="mb-4">
                   <label className="text-sm text-gray-500">แผนก</label>
                   <p>{selectedEvaluation.department}</p>
                 </div>
                 <div>
                   <label className="text-sm text-gray-500">รอบประเมิน</label>
                   <p>{selectedEvaluation.evaluationPeriod}</p>
                 </div>
               </div>
             </div>
             
             {/* Evaluation Form */}
             {selectedEvaluation.status === 'pending' ? (
               <div>
                 <h4 className="font-medium mb-4">หัวข้อการประเมิน</h4>
                 <div className="space-y-4">
                   {Object.entries(evaluationCriteria).map(([criteria, config]) => (
                     <div key={criteria} className="grid grid-cols-2 gap-4 items-center">
                       <div>
                         <label className="text-sm font-medium">{criteria}</label>
                         <p className="text-sm text-gray-500">น้ำหนัก {config.weight}%</p>
                       </div>
                       <ScoreInput 
                         criteria={criteria}
                         score={selectedEvaluation.scores[criteria]}
                         onChange={(criteria, score) => {
                           setSelectedEvaluation(prev => ({
                             ...prev,
                             scores: {
                               ...prev.scores,
                               [criteria]: score
                             }
                           }));
                         }}
                       />
                     </div>
                   ))}
                   <div className="mt-4">
                     <label className="block text-sm font-medium mb-2">ความคิดเห็นเพิ่มเติม</label>
                     <textarea
                       className="w-full border rounded-lg p-2"
                       rows="4"
                       value={selectedEvaluation.feedback}
                       onChange={(e) => {
                         setSelectedEvaluation(prev => ({
                           ...prev,
                           feedback: e.target.value
                         }));
                       }}
                     />
                   </div>
                 </div>
               </div>
             ) : (
               <div>
                 <h4 className="font-medium mb-4">ผลการประเมิน</h4>
                 <div className="space-y-4">
                   {Object.entries(selectedEvaluation.scores).map(([criteria, score]) => (
                     <div key={criteria} className="flex justify-between items-center">
                       <span>{criteria}</span>
                       <div className="flex items-center">
                         {[1,2,3,4,5].map(value => (
                           <Star 
                             key={value}
                             className={`w-5 h-5 ${
                               score >= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
                             }`}
                           />
                         ))}
                       </div>
                     </div>
                   ))}
                   <div className="mt-4 pt-4 border-t">
                     <div className="flex justify-between items-center">
                       <span className="font-medium">คะแนนรวม</span>
                       <span className="text-lg font-bold">{selectedEvaluation.totalScore.toFixed(2)}</span>
                     </div>
                     <p className="mt-2 text-gray-600">{selectedEvaluation.feedback}</p>
                   </div>
                 </div>
               </div>
             )}
             
             <div className="flex justify-end gap-2 mt-6">
               <button 
                 onClick={() => setShowModal(false)}
                 className="px-4 py-2 border rounded-lg"
               >
                 ปิด
               </button>
               {selectedEvaluation.status === 'pending' && (
                 <button
                   onClick={() => {
                     handleEvaluate(
                       selectedEvaluation.id,
                       selectedEvaluation.scores,
                       selectedEvaluation.feedback
                     );
                     setShowModal(false);
                   }}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                 >
                   บันทึกการประเมิน
                 </button>
               )}
             </div>
           </div>
         </div>
       </div>
     )}

     {/* Criteria Management Modal */}
     {showCriteriaModal && <CriteriaManagementModal />}

     {/* Notifications */}
     <div className="fixed bottom-4 right-4 space-y-2">
       {notifications.map(notification => (
         <Alert key={notification.id} type={notification.type}>
           <AlertDescription>
             {notification.message}
           </AlertDescription>
         </Alert>
       ))}
     </div>
   </div>
 );
};

export default EvaluationPage;