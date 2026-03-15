const express = require("express");
const {connectMonogoDb}= require("./connection");

const logReqRes=require("./middlewares")
const userRouter= require("./routes/user")

const app = express();
PORT = 8000;


//connection
connectMonogoDb("mongodb://127.0.0.1:27017/youtube-app-1").then(()=>{
    console.log("MongoDb connected")
})

app.use(express.urlencoded({extended:false}))
app.use(logReqRes("log.txt"))

//Routes
app.use("/user",userRouter)

app.listen(PORT, () => console.log(`Server is renderend at ${PORT}`));


