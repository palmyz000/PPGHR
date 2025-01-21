export const DocumentModal = ({ employee, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">เอกสารของพนักงาน</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
  
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  อัพโหลดเอกสาร
                </button>
              </div>
  
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ชื่อเอกสาร
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      วันที่อัพเดท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employee.documents?.map((doc, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-6 py-4">{doc.type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          doc.status === 'complete' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status === 'complete' ? 'เรียบร้อย' : 'รอดำเนินการ'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{doc.updatedAt || '-'}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          ดาวน์โหลด
                        </button>
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