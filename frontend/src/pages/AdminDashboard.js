import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import { Users, Building2, Settings, PieChart, Bell, Search, Eye, Edit, Trash, Plus, Power } from 'lucide-react';

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token ไม่ถูกต้อง');
        
        const response = await fetch('http://localhost:8000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้');
        }

        const data = await response.json();
        setProfile(data.data);
        
      } catch (err) {
        
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const renderContent = () => {
    switch(activeMenu) {
      case 'dashboard':
        return <DashboardContent />;
      case 'companies':
        return <CompaniesPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">ระบบจัดการ HR</h1>
        </div>
        
        <nav className="mt-4">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`flex items-center w-full p-4 ${
              activeMenu === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <PieChart className="w-5 h-5 mr-3" />
            แดชบอร์ด
          </button>
          
          <button
            onClick={() => setActiveMenu('companies')}
            className={`flex items-center w-full p-4 ${
              activeMenu === 'companies' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Building2 className="w-5 h-5 mr-3" />
            บริษัทลูกค้า
          </button>

          <button
            onClick={() => setActiveMenu('users')}
            className={`flex items-center w-full p-4 ${
              activeMenu === 'users' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            ผู้ใช้งาน
          </button>

          <button
            onClick={() => setActiveMenu('settings')}
            className={`flex items-center w-full p-4 ${
              activeMenu === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            ตั้งค่า
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white p-4 shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหา..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">
                {loading


                  ? 'ไม่สามารถโหลดข้อมูลได้'
                  : profile
                  ? profile.name
                  : 'ผู้ใช้'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </div>
  );
};

const DashboardContent = () => {
  const companies = [
    { id: 1, name: 'บริษัท A', employees: 150, status: 'active' },
    { id: 2, name: 'บริษัท B', employees: 75, status: 'pending' },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">บริษัทที่ใช้งานทั้งหมด</p>
                <h3 className="text-2xl font-bold">25</h3>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">ผู้ใช้งานทั้งหมด</p>
                <h3 className="text-2xl font-bold">1,234</h3>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">บริษัทที่รอดำเนินการ</p>
                <h3 className="text-2xl font-bold">5</h3>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">บริษัทล่าสุด</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">ชื่อบริษัท</th>
                  <th className="text-left p-4">จำนวนพนักงาน</th>
                  <th className="text-left p-4">สถานะ</th>
                  <th className="text-left p-4">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => (
                  <tr key={company.id} className="border-b">
                    <td className="p-4">{company.name}</td>
                    <td className="p-4">{company.employees}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        company.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {company.status === 'active' ? 'ใช้งาน' : 'รอดำเนินการ'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        จัดการ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CompaniesPage = () => {
  const companies = [
    { 
      id: 1, 
      name: 'บริษัท A', 
      domain: 'companya.hr.com',
      employees: 150,
      package: 'Enterprise',
      status: 'active'
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">บริษัทลูกค้า</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มบริษัท
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">ชื่อบริษัท</th>
                  <th className="text-left p-4">โดเมน</th>
                  <th className="text-left p-4">แพ็คเกจ</th>
                  <th className="text-left p-4">พนักงาน</th>
                  <th className="text-left p-4">สถานะ</th>
                  <th className="text-left p-4">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => (
                  <tr key={company.id} className="border-b">
                    <td className="p-4">{company.name}</td>
                    <td className="p-4">{company.domain}</td>
                    <td className="p-4">{company.package}</td>
                    <td className="p-4">{company.employees}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        company.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {company.status === 'active' ? 'ใช้งาน' : 'ระงับ'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const UsersPage = () => {
  const users = [
    {
      id: 1,
      name: 'แอดมิน A',
      email: 'admin@companya.com',
      role: 'Super Admin',
      lastLogin: '2024-01-24 10:30',
      status: 'active'
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ผู้ใช้งานระบบ</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มผู้ใช้
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">ชื่อ</th>
                  <th className="text-left p-4">อีเมล</th>
                  <th className="text-left p-4">บทบาท</th>
                  <th className="text-left p-4">เข้าสู่ระบบล่าสุด</th>
                  <th className="text-left p-4">สถานะ</th>
                  <th className="text-left p-4">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">{user.lastLogin}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'ใช้งาน' : 'ระงับ'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="text-green-600 hover:text-green-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ตั้งค่าระบบ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">ตั้งค่าทั่วไป</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อระบบ</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="HR Management System"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">โลโก้</label>
                <div className="border-2 border-dashed rounded p-4 text-center">
                  <button className="text-blue-600">อัพโหลดรูปภาพ</button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">การแจ้งเตือน</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>แจ้งเตือนทางอีเมล</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>แจ้งเตือนในระบบ</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">แพ็คเกจเริ่มต้น</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">แพ็คเกจสำหรับบริษัทใหม่</label>
                <select className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500">
                  <option>Starter</option>
                  <option>Professional</option>
                  <option>Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ระยะเวลาทดลองใช้</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">การสำรองข้อมูล</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>สำรองข้อมูลอัตโนมัติ</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ความถี่ในการสำรองข้อมูล</label>
                <select className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500">
                  <option>ทุกวัน</option>
                  <option>ทุกสัปดาห์</option>
                  <option>ทุกเดือน</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;