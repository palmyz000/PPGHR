const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./modules/employee/employeeRoutes');
const documentRoutes = require('./modules/document/documentRoutes');
const payrollRoutes = require('./modules/payroll/payrollRoutes');
const authRoutes = require('./modules/auth/authRoutes');
const tenantRoutes = require('./modules/tenant/tenantRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/employees', employeeRoutes); 
app.use('/api/documents', documentRoutes); 
app.use('/api/payroll', payrollRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tenant', tenantRoutes);



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
