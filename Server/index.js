// const { log } = require("console");
const http = require("http");

const myServer= http.createServer((req,res)=>{
    // console.log(req.headers)
    console.log(req)
    res.end("Hello From Server Again")
})

myServer.listen(8000,()=> console.log("server started"));
