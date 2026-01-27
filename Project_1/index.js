const express = require("express")
const users= require("./MOCK_DATA.json")

const app = express();
PORT=8000;

app.get("/users", (req,res)=>{
    return res.json(users);
})

//Routes


app.listen(PORT,()=>console.log(`Server is renderend at ${PORT}`));
