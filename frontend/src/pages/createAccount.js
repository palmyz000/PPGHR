import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/Card';
import { Users, Building2, Lock, Mail, ChevronDown } from 'lucide-react';

const CreateAccount = () => {
  const [tenants, setTenants] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedTenantName, setSelectedTenantName] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [selectedEmpCode, setSelectedEmpCode] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee',
  });

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/tenant/all-tenant');
        if (!response.ok) throw new Error('Failed to fetch tenants');
        const data = await response.json();
        setTenants(data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchTenants();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/employees/all');
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        setEmployees(data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedTenantName) {
      const selectedTenant = tenants.find((tenant) => tenant.tenant_name === selectedTenantName);
      if (selectedTenant) {
        setSelectedTenantId(selectedTenant.tenant_id);
        const filtered = employees.filter((emp) => emp.tenant_id === selectedTenant.tenant_id);
        setFilteredEmployees(filtered);
      }
    } else {
      setFilteredEmployees([]);
    }
  }, [selectedTenantName, tenants, employees]);

  useEffect(() => {
    if (selectedEmpCode) {
      const selectedEmployee = filteredEmployees.find((emp) => emp.emp_code === selectedEmpCode);
      if (selectedEmployee) {
        setFormData(prev => ({ ...prev, email: selectedEmployee.email || '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, email: '' }));
    }
  }, [selectedEmpCode, filteredEmployees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: selectedTenantId,
          emp_code: selectedEmpCode,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!response.ok) throw new Error('Failed to create account');
      alert('สร้างบัญชีสำเร็จ');
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">สร้างบัญชีผู้ใช้งาน</h2>
            <p className="text-gray-600">กรอกข้อมูลเพื่อสร้างบัญชีใหม่</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  บริษัท
                </div>
              </label>
              <div className="relative">
                <select
                  className="w-full p-2.5 bg-white border rounded-lg appearance-none pr-10 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSelectedTenantName(e.target.value)}
                  value={selectedTenantName}
                >
                  <option value="">เลือกบริษัท</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.tenant_id} value={tenant.tenant_name}>
                      {tenant.tenant_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  พนักงาน
                </div>
              </label>
              <div className="relative">
                <select
                  className="w-full p-2.5 bg-white border rounded-lg appearance-none pr-10 focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSelectedEmpCode(e.target.value)}
                  value={selectedEmpCode}
                  disabled={!selectedTenantName}
                >
                  <option value="">เลือกพนักงาน</option>
                  {filteredEmployees.map((emp) => (
                    <option key={emp.emp_code} value={emp.emp_code}>
                      {emp.name} ({emp.position})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  อีเมล
                </div>
              </label>
              <input
                type="email"
                className="w-full p-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  รหัสผ่าน
                </div>
              </label>
              <input
                type="password"
                className="w-full p-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">สิทธิ์การใช้งาน</label>
              <div className="relative">
                <select
                  className="w-full p-2.5 bg-white border rounded-lg appearance-none pr-10 focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="employee">พนักงาน</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              สร้างบัญชี
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAccount;