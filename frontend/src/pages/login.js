import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/Card";
import { Mail, Lock, Building2, Loader } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const getCompanyInfo = async () => {
      if (formData.email) {
        try {
          const response = await axios.get(`http://localhost:8000/api/employees/ByEmail/${formData.email}`);
          setCompanyInfo(response.data);
          setError("");
        } catch (err) {
          setError("ไม่พบข้อมูลพนักงาน");
          setCompanyInfo(null);
        }
      }
    };
    getCompanyInfo();
  }, [formData.email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!companyInfo) return;
  
    setError("");
    setIsLoading(true);
  
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        ...formData,
        tenant_id: companyInfo.tenant_id
      });
  
      const { token, tenant_id, role } = response.data;
  
      // เก็บข้อมูลใน localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("tenant_id", tenant_id);
      localStorage.setItem("role", role);
  
      // แยกการนำทางตาม role
      if (role === "admin") {
        window.location.href = "/admin-dashboard"; // เปลี่ยนเป็น URL สำหรับ admin
      } else if (role === "employee") {
        window.location.href = "/dashboard"; // เปลี่ยนเป็น URL สำหรับ employee
      } else if (role === "hr") {
        window.location.href = "/hr-dashboard"; // เปลี่ยนเป็น URL สำหรับ HR
      } else {
        setError("Role ไม่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบ");
      }
    } catch (err) {
      setError(err.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
            <p className="text-gray-600">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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

            {companyInfo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    บริษัท
                  </div>
                </label>
                <div className="w-full p-2.5 bg-gray-50 border rounded-lg text-gray-700">
                  {companyInfo.tenant_name}
                </div>
              </div>
            )}

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

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isLoading || !companyInfo}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;