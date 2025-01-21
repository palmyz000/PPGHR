const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const documentRoutes = require('./routes/documentRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/employees', employeeRoutes); 
app.use('/api/documents', documentRoutes); 

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
