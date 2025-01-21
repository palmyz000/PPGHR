export const ActionMenu = ({ employee, onAction }) => (
    <div className="relative group">
      <button className="text-gray-400 hover:text-gray-600">
        <MoreVertical className="w-5 h-5" />
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
        <div className="py-1">
          <button 
            onClick={() => onAction('view', employee)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            ดูข้อมูลพนักงาน
          </button>
          <button 
            onClick={() => onAction('documents', employee)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            จัดการเอกสาร
          </button>
          <button 
            onClick={() => onAction('leaves', employee)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            ประวัติการลา
          </button>
          <button 
            onClick={() => onAction('evaluations', employee)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            ผลการประเมิน
          </button>
          <button 
            onClick={() => onAction('salary', employee)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-t"
          >
            ประวัติเงินเดือน
          </button>
          <button 
            onClick={() => onAction('edit', employee)}
            className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left border-t"
          >
            แก้ไขข้อมูล
          </button>
        </div>
      </div>
    </div>
  );