const express = require("express");
const app = express();

app.get('/food-app', async(req , res)=>{

  let obj={
    username:"sakshi",
    lastname:"sharma"

  }
  res.send (obj)
})


app.listen(8000,()=>{
  console.log("my server is running on port 3000");

})