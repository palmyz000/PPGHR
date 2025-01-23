import React, { useState, useEffect } from 'react';


const CreateAccount = () => {
  const [tenants, setTenants] = useState([]); // เก็บข้อมูล Tenant
  const [employees, setEmployees] = useState([]); // เก็บข้อมูลพนักงานทั้งหมด
  const [filteredEmployees, setFilteredEmployees] = useState([]); // เก็บข้อมูลพนักงานที่กรอง
  const [selectedTenantName, setSelectedTenantName] = useState(''); // Tenant ที่เลือก
  const [selectedTenantId, setSelectedTenantId] = useState(null); // tenant_id ที่เลือก
  const [selectedEmpCode, setSelectedEmpCode] = useState(''); // พนักงานที่เลือก
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee',
  });

  // ดึงข้อมูล Tenant
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/tenant/all-tenant');
        if (!response.ok) throw new Error('Failed to fetch tenants');
        const data = await response.json();
        setTenants(data.data); // บันทึกข้อมูล Tenant
      } catch (error) {
        console.error('Error fetching tenants:', error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูล Tenants');
      }
    };

    fetchTenants();
  }, []);

  // ดึงข้อมูลพนักงานทั้งหมด
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/employees/all');
        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        setEmployees(data.data); // บันทึกข้อมูลพนักงานทั้งหมด
      } catch (error) {
        console.error('Error fetching employees:', error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน');
      }
    };

    fetchEmployees();
  }, []);

  // เมื่อ Tenant ถูกเลือก กรองพนักงานตาม tenant_id
  useEffect(() => {
    if (selectedTenantName) {
      const selectedTenant = tenants.find((tenant) => tenant.tenant_name === selectedTenantName);
      if (selectedTenant) {
        setSelectedTenantId(selectedTenant.tenant_id); // บันทึก tenant_id

        // กรองข้อมูลพนักงานตาม tenant_id
        const filtered = employees.filter((emp) => emp.tenant_id === selectedTenant.tenant_id);
        setFilteredEmployees(filtered);
      }
    } else {
      setFilteredEmployees([]); // รีเซ็ตถ้าไม่มี Tenant ถูกเลือก
    }
  }, [selectedTenantName, tenants, employees]);

  // เมื่อเลือกพนักงาน ให้เติม email ลงในฟิลด์โดยอัตโนมัติ
  useEffect(() => {
    if (selectedEmpCode) {
      const selectedEmployee = filteredEmployees.find((emp) => emp.emp_code === selectedEmpCode);
      if (selectedEmployee) {
        setFormData((prevData) => ({
          ...prevData,
          email: selectedEmployee.email || '', // เติม email ถ้ามีข้อมูล
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        email: '', // รีเซ็ต email ถ้าไม่มีการเลือกพนักงาน
      }));
    }
  }, [selectedEmpCode, filteredEmployees]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/auth/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      console.error('Error creating account:', error);
      alert('เกิดข้อผิดพลาดในการสร้างบัญชี');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">สร้างบัญชีผู้ใช้งาน</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">เลือก Tenant:</label>
          <select
            className="form-select"
            onChange={(e) => setSelectedTenantName(e.target.value)}
            value={selectedTenantName}
          >
            <option value="">-- เลือก Tenant --</option>
            {tenants.map((tenant) => (
              <option key={tenant.tenant_id} value={tenant.tenant_name}>
                {tenant.tenant_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">เลือกพนักงาน:</label>
          <select
            className="form-select"
            onChange={(e) => setSelectedEmpCode(e.target.value)}
            value={selectedEmpCode}
            disabled={!selectedTenantName}
          >
            <option value="">-- เลือกพนักงาน --</option>
            {filteredEmployees.map((emp) => (
              <option key={emp.emp_code} value={emp.emp_code}>
                {emp.name} ({emp.position})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role:</label>
          <select
            className="form-select"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          สร้างบัญชี
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;