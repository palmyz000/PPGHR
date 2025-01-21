const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/employees', employeeRoutes); // เพิ่ม Route พนักงาน

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
