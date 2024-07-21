const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.json())
app.use(cors());
const authRoutes = require('./Routes/authRoutes');

app.use('/api/auth', authRoutes);
 

app.listen(8000,()=>{
  console.log("my server is running on port 3000");

})