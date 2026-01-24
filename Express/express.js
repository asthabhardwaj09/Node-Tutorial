// const http =require ("http")
const express = require("express")

const app=express()

app.get('/' ,(req,res)=>{
    return res.send("Hello from Home Page")
})

app.get("/about",(req,res)=>{
    return res.send("Hello from About Page " + "hey" + req.query.name)
})

// const myServer= http.createServer(app)

// myServer.listen(7000,()=> console.log("Server Started"));

app.listen(7000,()=>console.log("Server Started"));

